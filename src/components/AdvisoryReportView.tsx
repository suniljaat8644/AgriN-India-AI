import React, { useState, useRef } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Printer,
  Share2,
  CheckCircle,
  Sparkles,
  PhoneCall,
  ThermometerSun,
  Send,
  RotateCcw,
  Check,
  ArrowRight,
  Satellite,
  MapPin,
} from 'lucide-react';
import { AdvisoryReport, FarmContext } from '../types';
import { LANGUAGES } from '../data/presets';
import { TRANSLATIONS } from '../data/translations';
import { InteractiveFarmMap } from './InteractiveFarmMap';

interface AdvisoryReportViewProps {
  report: AdvisoryReport;
  context: FarmContext;
  onReset: () => void;
  onOpenRecipes: () => void;
}

export const AdvisoryReportView: React.FC<AdvisoryReportViewProps> = ({
  report,
  context,
  onReset,
  onOpenRecipes,
}) => {
  const t = TRANSLATIONS[context.language] || TRANSLATIONS.en;

  const [isPlaying, setIsPlaying] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [followupQuestion, setFollowupQuestion] = useState('');
  const [followupLoading, setFollowupLoading] = useState(false);
  const [followupHistory, setFollowupHistory] = useState<
    Array<{ q: string; a: string }>
  >([]);
  const [copiedShare, setCopiedShare] = useState(false);
  const [followupError, setFollowupError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play audio advisory using backend Gemini TTS (or browser speech synthesis fallback)
  const handleToggleAudio = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textToSpeak = report.regionalVoiceSummary ||
      `${context.language === 'en' ? report.diagnosis.diseaseName : (report.diagnosis.diseaseNameRegional || report.diagnosis.diseaseName)}. ${report.organicTreatments[0]?.title}.`;

    try {
      setTtsLoading(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          language: context.language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
          const audio = new Audio(audioSrc);
          audio.playbackRate = playbackSpeed;
          audioRef.current = audio;

          audio.onended = () => setIsPlaying(false);
          audio.onerror = () => {
            console.warn('Backend audio failed, falling back to Web Speech API');
            fallbackWebSpeech(textToSpeak);
          };

          await audio.play();
          setIsPlaying(true);
          setTtsLoading(false);
          return;
        }
      }
      fallbackWebSpeech(textToSpeak);
    } catch (err) {
      console.warn('TTS API error, falling back to Web Speech API', err);
      fallbackWebSpeech(textToSpeak);
    } finally {
      setTtsLoading(false);
    }
  };

  const fallbackWebSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setFollowupError('Speech synthesis not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langConfig = LANGUAGES.find((l) => l.code === context.language);
    utterance.lang = langConfig ? langConfig.speechCode : 'hi-IN';
    utterance.rate = playbackSpeed;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  // Follow-up interaction
  const handleSendFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupQuestion.trim() || followupLoading) return;

    const q = followupQuestion.trim();
    setFollowupLoading(true);
    setFollowupError(null);

    try {
      const res = await fetch('/api/ask-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          advisoryContext: {
            crop: context.cropType,
            location: context.stateDistrict,
            diagnosis: report.diagnosis,
            organicTreatments: report.organicTreatments,
          },
          question: q,
          language: context.language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setFollowupHistory((prev) => [...prev, { q, a: data.answer }]);
        setFollowupQuestion('');
      } else {
        setFollowupError('Could not get answer for follow-up question. Please retry.');
      }
    } catch (err) {
      console.error(err);
      setFollowupError('Network error while asking follow-up.');
    } finally {
      setFollowupLoading(false);
    }
  };

  // Share text on WhatsApp / Copy
  const handleShare = () => {
    const diseaseName = context.language === 'en'
      ? report.diagnosis.diseaseName
      : (report.diagnosis.diseaseNameRegional || report.diagnosis.diseaseName);
    const treatmentTitle = context.language === 'en'
      ? report.organicTreatments[0]?.title
      : (report.organicTreatments[0]?.titleRegional || report.organicTreatments[0]?.title);

    const satSummary = report.satelliteTelemetry
      ? `\n🛰️ ${t.satelliteNdviLabel}: ${report.satelliteTelemetry.ndviStatus}\n💧 ${t.soilMoistureThermalLabel}: ${report.satelliteTelemetry.soilMoistureThermalProfile}\n⚠️ ${t.geospatialRiskLabel}: ${report.satelliteTelemetry.geospatialRiskAlert}\n🔄 ${t.actionableMitigationLabel}: ${report.satelliteTelemetry.actionableMitigation}\n`
      : '';

    const text = `🌾 *${t.reportTitle}*
📍 ${t.locationLabel}: ${context.stateDistrict}
🌱 ${t.cropLabel}: ${context.cropType} (${context.growthStage})
🩺 ${t.sec1Title}: ${diseaseName}
🔬 ${t.severityLabel}: ${report.diagnosis.severity} (${t.confidenceLabel}: ${report.diagnosis.confidence}%)${satSummary}
💡 ${t.sec2Title}: ${treatmentTitle} - ${report.organicTreatments[0]?.dosageAndApplication}
📞 ${t.kisanCallCenter}: 1800-180-1551 (${t.tollFree})
${t.zeroChemicalsBadge}`;

    if (navigator.share) {
      navigator.share({
        title: t.reportTitle,
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 text-white border-red-700 animate-pulse';
      case 'severe':
        return 'bg-orange-600 text-white border-orange-700';
      case 'moderate':
        return 'bg-amber-500 text-stone-950 border-amber-600';
      default:
        return 'bg-emerald-600 text-white border-emerald-700';
    }
  };

  const diseaseDisplayTitle = context.language === 'en'
    ? report.diagnosis.diseaseName
    : (report.diagnosis.diseaseNameRegional || report.diagnosis.diseaseName);

  return (
    <div className="space-y-6 print:space-y-4 print:text-black">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            {t.verifiedAdvisory}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 mt-1">
            {t.reportTitle}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Report ID: <span className="font-mono text-stone-700">AGRIN-IN-{Math.floor(100000 + Math.random() * 900000)}</span> • {t.reportFor} {context.stateDistrict}
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden flex-wrap">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" /> {t.copiedText}
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-stone-600" /> {t.shareWhatsApp}
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            {t.printParchi}
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.newInspection}
          </button>
        </div>
      </div>

      {/* Voice-First Regional Audio Player Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-800 text-white rounded-2xl p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            onClick={handleToggleAudio}
            disabled={ttsLoading}
            className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-amber-300 text-stone-950 animate-pulse'
                : 'bg-white text-emerald-900 hover:bg-amber-50'
            }`}
            title={t.voiceAdvisory}
          >
            {ttsLoading ? (
              <div className="w-5 h-5 border-2 border-emerald-900/30 border-t-emerald-900 rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6 fill-stone-950" />
            ) : (
              <Play className="w-6 h-6 fill-emerald-900 ml-0.5" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200 bg-amber-950/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" /> {t.voiceAdvisory}
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-1 leading-snug max-w-xl">
              {report.regionalVoiceSummary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[11px] text-amber-200">{t.speed}</span>
          {[0.8, 1.0, 1.2].map((spd) => (
            <button
              key={spd}
              onClick={() => {
                setPlaybackSpeed(spd);
                if (audioRef.current) audioRef.current.playbackRate = spd;
              }}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                playbackSpeed === spd
                  ? 'bg-white text-stone-900 font-bold'
                  : 'bg-amber-900/40 text-amber-100 hover:bg-amber-900/60'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Diagnosis / Assessment */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="text-base font-bold text-stone-900 uppercase tracking-wide">
              {t.sec1Title}
            </h3>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${getSeverityBadgeClass(
              report.diagnosis.severity
            )}`}
          >
            {t.severityLabel} {report.diagnosis.severity}
          </span>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Disease Details */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-lime-100 text-lime-900">
                    {report.diagnosis.category}
                  </span>
                  <span className="text-xs font-medium text-stone-500">
                    {t.confidenceLabel} <strong>{report.diagnosis.confidence}%</strong>
                  </span>
                </div>
                {/* Shows ONLY ONE disease title in the active language */}
                <h4 className="text-2xl font-bold font-serif text-stone-900 mt-1">
                  {diseaseDisplayTitle}
                </h4>
                <div className="text-xs font-mono text-stone-500 mt-0.5">
                  <em>{report.diagnosis.pathogenOrCause}</em>
                </div>
              </div>

              {/* Symptoms Identified */}
              <div>
                <h5 className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-2">
                  {t.observedSymptoms}
                </h5>
                <ul className="space-y-1.5">
                  {report.diagnosis.visualSymptoms.map((sym, i) => (
                    <li key={i} className="text-xs text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weather & Soil Correlation */}
              <div className="bg-amber-50/80 rounded-xl p-3.5 border border-amber-200/80 text-xs text-stone-800">
                <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <ThermometerSun className="w-4 h-4 text-amber-700" />
                  {t.agroClimaticTrigger} ({context.stateDistrict}):
                </div>
                <p className="leading-relaxed">
                  {report.diagnosis.weatherSoilCorrelation}
                </p>
              </div>
            </div>

            {/* Right Col: Leaf Specimen Image & Farm Parameters */}
            <div className="space-y-3">
              {context.imagePreview && (
                <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-900 shadow-inner">
                  <img
                    src={context.imagePreview}
                    alt="Analyzed Leaf Specimen"
                    className="w-full h-44 object-contain bg-stone-950"
                  />
                  <div className="p-2 text-center text-[10px] text-stone-400 bg-stone-900">
                    {t.inspectedSpecimen}
                  </div>
                </div>
              )}

              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs space-y-1.5">
                <div className="text-[11px] font-bold text-stone-500 uppercase">{t.farmContextRecorded}</div>
                <div><strong>{t.cropLabel}:</strong> {context.cropType}</div>
                <div><strong>{t.growthStageLabel}:</strong> {context.growthStage}</div>
                <div><strong>{t.soilLabel}:</strong> {context.soilCondition}</div>
                <div><strong>{t.weatherLabel}:</strong> {context.weatherForecast}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SATELLITE TELEMETRY & GEOSPATIAL ANALYSIS SECTION */}
      {report.satelliteTelemetry && (
        <div className="bg-white rounded-2xl border border-teal-200/90 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-teal-900 via-stone-900 to-emerald-950 text-white px-6 py-3.5 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 text-sm font-bold flex items-center justify-center">
                <Satellite className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold uppercase tracking-wide text-teal-200">
                  {t.satelliteTitle}
                </h3>
                <p className="text-[11px] text-teal-300/80">
                  {t.satelliteSubtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-700/60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {report.satelliteTelemetry.satelliteSource || 'ISRO Bhuvan & Sentinel-2'}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Exact Structured Output Format Required */}
            <div className="bg-stone-50/90 rounded-2xl p-5 border border-stone-200 space-y-3.5 text-stone-900 shadow-xs">
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0 select-none">🛰️</span>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    {t.satelliteNdviLabel}
                  </div>
                  <div className="text-sm font-semibold text-stone-900">
                    {report.satelliteTelemetry.ndviStatus}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2.5 border-t border-stone-200/80">
                <span className="text-xl shrink-0 select-none">💧</span>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    {t.soilMoistureThermalLabel}
                  </div>
                  <div className="text-sm font-semibold text-stone-900">
                    {report.satelliteTelemetry.soilMoistureThermalProfile}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2.5 border-t border-stone-200/80 bg-amber-50/70 -mx-5 px-5 py-2.5 rounded-xl border border-amber-200/70">
                <span className="text-xl shrink-0 select-none">⚠️</span>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    {t.geospatialRiskLabel}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-amber-950 leading-relaxed">
                    {report.satelliteTelemetry.geospatialRiskAlert}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2.5 border-t border-stone-200/80 bg-emerald-50/70 -mx-5 px-5 py-2.5 rounded-xl border border-emerald-200/70">
                <span className="text-xl shrink-0 select-none">🔄</span>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    {t.actionableMitigationLabel}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-emerald-950 leading-relaxed">
                    {report.satelliteTelemetry.actionableMitigation}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Gauges and Sensor Readings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-semibold">NDVI Index</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {report.satelliteTelemetry.ndviValue}
                  </span>
                </div>
                <div className="h-2 rounded-full w-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-600 relative">
                  <div
                    className="absolute -top-1 w-4 h-4 bg-white border-2 border-emerald-800 rounded-full shadow"
                    style={{
                      left: `calc(${Math.min(Math.max(((report.satelliteTelemetry.ndviValue ?? 0.45) - 0.1) / 0.8, 0), 1) * 100}% - 8px)`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                  <span>0.1 (Barren)</span>
                  <span>0.5</span>
                  <span>0.9 (Vigorous)</span>
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-semibold">Root Moisture</span>
                  <span className="font-mono font-bold text-cyan-700">
                    {report.satelliteTelemetry.soilMoisture ?? context.telemetrySoilMoisture ?? 22}%
                  </span>
                </div>
                <div className="h-2 rounded-full w-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-cyan-600 rounded-full"
                    style={{
                      width: `${Math.min(Math.max((report.satelliteTelemetry.soilMoisture ?? context.telemetrySoilMoisture ?? 22) * 1.6, 5), 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                  <span>10% (Deficit)</span>
                  <span>35% (Optimal)</span>
                  <span>60% (Saturated)</span>
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-semibold">Surface Temp</span>
                  <span className="font-mono font-bold text-orange-700">
                    {report.satelliteTelemetry.surfaceTemp ?? context.telemetrySurfaceTemp ?? 33.5}°C
                  </span>
                </div>
                <div className="h-2 rounded-full w-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 via-amber-400 to-red-600 rounded-full"
                    style={{
                      width: `${Math.min(Math.max((((report.satelliteTelemetry.surfaceTemp ?? context.telemetrySurfaceTemp ?? 33.5) - 15) / 30) * 100, 5), 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                  <span>15°C (Cool)</span>
                  <span>30°C</span>
                  <span>45°C (Heatwave)</span>
                </div>
              </div>
            </div>

            {/* Interactive Geospatial Farm Map Component */}
            <div className="pt-2">
              <InteractiveFarmMap
                coordinates={report.satelliteTelemetry.coordinates || context.coordinates}
                locationName={context.stateDistrict}
                cropType={context.cropType}
                growthStage={context.growthStage}
                ndviValue={report.satelliteTelemetry.ndviValue}
                soilMoisture={report.satelliteTelemetry.soilMoisture ?? context.telemetrySoilMoisture}
                surfaceTemp={report.satelliteTelemetry.surfaceTemp ?? context.telemetrySurfaceTemp}
                language={context.language}
              />
            </div>

            {(report.satelliteTelemetry.coordinates || context.coordinates) && (
              <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span><strong>{t.gpsCoordinatesLabel}:</strong> {report.satelliteTelemetry.coordinates || context.coordinates}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: Organic & Regenerative Treatment Steps */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="bg-emerald-800 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-lime-400 text-emerald-950 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="text-base font-bold uppercase tracking-wide">
              {t.sec2Title}
            </h3>
          </div>
          <button
            onClick={onOpenRecipes}
            className="text-xs font-semibold text-lime-300 hover:text-white underline cursor-pointer flex items-center gap-1"
          >
            <span>{t.viewHandbook}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-6 divide-y divide-stone-100">
          {report.organicTreatments.map((treatment, idx) => {
            const trTitle = context.language === 'en'
              ? treatment.title
              : (treatment.titleRegional || treatment.title);

            return (
              <div
                key={idx}
                className={`py-5 first:pt-0 last:pb-0 ${
                  idx === 0 ? 'bg-emerald-50/40 -mx-6 px-6 rounded-xl' : ''
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                      {treatment.stepNumber || idx + 1}
                    </span>
                    {/* Shows only single language title */}
                    <h4 className="text-lg font-bold text-stone-900">
                      {trTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      {treatment.category}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      ⏰ {treatment.timeOfDay}
                    </span>
                  </div>
                </div>

                <div className="ml-7 grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-xs">
                  <div className="md:col-span-2 space-y-2">
                    <div>
                      <strong className="text-stone-800">{t.recipeLabel}</strong>
                      <p className="text-stone-700 leading-relaxed mt-0.5">
                        {treatment.preparation}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-100/70 border border-emerald-200">
                      <strong className="text-emerald-950">{t.dosageLabel}</strong>
                      <p className="text-emerald-900 font-medium mt-0.5">
                        {treatment.dosageAndApplication}
                      </p>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                    <div className="font-bold text-stone-700 mb-1.5 uppercase text-[10px] tracking-wide">
                      {t.materialsNeeded}
                    </div>
                    <ul className="space-y-1">
                      {treatment.materialsNeeded.map((mat, mi) => (
                        <li key={mi} className="text-stone-600 flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{mat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Preventative & Long-Term Agro-Ecological Measures */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-700 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h3 className="text-base font-bold text-stone-900 uppercase tracking-wide">
              {t.sec3Title}
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">
            {t.soilRegenerationSubtext}
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.preventativeMeasures.map((measure, idx) => {
            const prTitle = context.language === 'en'
              ? measure.practice
              : (measure.practiceRegional || measure.practice);

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-sm font-bold text-stone-900">
                    {prTitle}
                  </h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    {measure.timeline}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mt-1">
                  <strong>{t.benefitLabel}</strong> {measure.benefit}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Localized Support & Government Scheme Reference */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="bg-stone-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h3 className="text-base font-bold uppercase tracking-wide">
              {t.sec4Title}
            </h3>
          </div>
          <a
            href="tel:18001801551"
            className="text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t.kisanCallCenter}: 1800-180-1551</span>
          </a>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.governmentSchemes.map((scheme, idx) => {
              const scTitle = context.language === 'en'
                ? scheme.schemeName
                : (scheme.schemeNameRegional || scheme.schemeName);

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 space-y-2 text-xs"
                >
                  <h4 className="text-sm font-bold text-stone-900">
                    {scTitle}
                  </h4>
                  <div className="text-stone-700">
                    <strong>{t.supportLabel}</strong> {scheme.applicableBenefit}
                  </div>
                  <div className="text-emerald-800 font-medium">
                    <strong>{t.actionStepLabel}</strong> {scheme.actionStep}
                  </div>
                  <div className="pt-1 border-t border-amber-200/60 font-mono text-[11px] text-stone-600">
                    {t.helplineLabel} <strong>{scheme.helplineOrPortal}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          {report.kvkGuidance && (
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-xs text-emerald-950">
              <strong className="block text-emerald-900 font-bold mb-1">
                📍 {t.kvkNotice}
              </strong>
              <p className="leading-relaxed">{report.kvkGuidance}</p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 5: Interactive Farmer Follow-up Questions Chat */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 print:hidden">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-stone-900">
            {t.sec5Title}
          </h3>
        </div>
        <p className="text-xs text-stone-500 mb-4">
          {t.followupSubtext}
        </p>

        {followupHistory.length > 0 && (
          <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-1">
            {followupHistory.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="bg-stone-100 rounded-xl p-2.5 text-stone-800 font-medium ml-4">
                  👤 <strong>{t.youAsked}</strong> {item.q}
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-emerald-950 border border-emerald-200/70 mr-4">
                  🌱 <strong>{t.aiAdvisor}</strong>
                  <div className="mt-1 whitespace-pre-line leading-relaxed">
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {followupError && (
          <p className="text-xs text-red-600 mb-2">{followupError}</p>
        )}

        <form onSubmit={handleSendFollowup} className="flex gap-2">
          <input
            type="text"
            value={followupQuestion}
            onChange={(e) => setFollowupQuestion(e.target.value)}
            placeholder={t.askPlaceholder}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-xs text-stone-900 bg-stone-50/50"
          />
          <button
            type="submit"
            disabled={followupLoading || !followupQuestion.trim()}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {followupLoading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{t.askButton}</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
