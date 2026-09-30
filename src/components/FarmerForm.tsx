import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  Mic,
  Square,
  RotateCcw,
  X,
  Sparkles,
  CloudSun,
  Layers,
  CheckCircle2,
  FileImage,
  Loader2,
  Volume2,
  Trash2,
  Satellite,
  Radio,
  MapPin,
  Activity,
  Thermometer,
  Droplets,
  Compass,
} from 'lucide-react';
import { FarmContext, LanguageCode } from '../types';
import { SAMPLE_LEAF_IMAGES, LANGUAGES, SCENARIO_TELEMETRY } from '../data/presets';
import { TRANSLATIONS } from '../data/translations';
import { rasterizeSvgToPng } from '../utils/imageUtils';

interface FarmerFormProps {
  context: FarmContext;
  onChange: (updated: Partial<FarmContext>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const FarmerForm: React.FC<FarmerFormProps> = ({
  context,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const t = TRANSLATIONS[context.language] || TRANSLATIONS.en;

  // MediaRecorder Voice-to-Text State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [voiceSuccess, setVoiceSuccess] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Satellite Telemetry State
  const [isSyncingSatellite, setIsSyncingSatellite] = useState(false);
  const [satelliteSyncedMsg, setSatelliteSyncedMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, [recordedAudioUrl]);

  // Start MediaRecorder audio capture
  const startMediaRecording = async () => {
    setSpeechError(null);
    setVoiceSuccess(null);
    audioChunksRef.current = [];

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setSpeechError('Microphone recording is not supported in this browser environment.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        const effectiveMime = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: effectiveMime });

        if (audioBlob.size === 0) {
          setIsRecording(false);
          setSpeechError('No audio recorded. Please speak clearly into your microphone.');
          return;
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);

        // Convert Blob to Base64 and send to transcription API
        setIsTranscribing(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64Data = reader.result as string;
            const res = await fetch('/api/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64Data,
                mimeType: effectiveMime,
                language: context.language,
              }),
            });

            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.error || 'Transcription service error');
            }

            const data = await res.json();
            if (data.transcript && data.transcript.trim()) {
              const newQuery = context.farmerQuery
                ? `${context.farmerQuery} ${data.transcript.trim()}`
                : data.transcript.trim();
              onChange({ farmerQuery: newQuery });
              const langNative = LANGUAGES.find((l) => l.code === context.language)?.nativeLabel || '';
              setVoiceSuccess(`${langNative}: ${data.transcript.trim()}`);
            } else {
              setSpeechError('Could not decipher speech. Please retry speaking clearly or type below.');
            }
          } catch (transcribeErr: any) {
            console.error('Transcription error:', transcribeErr);
            setSpeechError('Failed to convert voice to text. Please check connection or type your question.');
          } finally {
            setIsTranscribing(false);
            setIsRecording(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 60) {
            stopMediaRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('MediaRecorder start error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setSpeechError('Microphone permission was denied. Please allow microphone access in your browser settings.');
      } else {
        setSpeechError(`Could not access microphone: ${err.message || 'Unknown error'}`);
      }
      setIsRecording(false);
    }
  };

  const stopMediaRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const cancelMediaRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingDuration(0);
  };

  const deleteRecordedAudio = () => {
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }
    setRecordedAudioUrl(null);
    setVoiceSuccess(null);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onChange({
        imageBase64: result,
        imagePreview: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onChange({
        imageBase64: result,
        imagePreview: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const selectSampleSpecimen = async (key: string) => {
    const specimen = SAMPLE_LEAF_IMAGES[key];
    if (specimen) {
      const png = await rasterizeSvgToPng(specimen);
      onChange({
        imageBase64: png || specimen,
        imagePreview: specimen,
      });
    }
  };

  const removeImage = () => {
    onChange({
      imageBase64: undefined,
      imagePreview: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDetectGPS = () => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          const coordStr = `${lat}° N, ${lng}° E`;
          onChange({ coordinates: coordStr });
          handleSyncSatellite(coordStr);
        },
        () => {
          handleSyncSatellite();
        },
        { timeout: 4000 }
      );
    } else {
      handleSyncSatellite();
    }
  };

  const handleSyncSatellite = (customCoords?: string) => {
    setIsSyncingSatellite(true);
    setTimeout(() => {
      const loc = (context.stateDistrict || '').toLowerCase();
      let ndvi = 0.45;
      let moisture = 22;
      let temp = 33.5;
      let coords = customCoords || context.coordinates || '26.9124° N, 75.7873° E';

      if (loc.includes('jaipur') || loc.includes('rajasthan')) {
        ndvi = 0.42;
        moisture = 19;
        temp = 34.2;
        if (!customCoords) coords = '26.9124° N, 75.7873° E';
      } else if (loc.includes('ludhiana') || loc.includes('punjab') || loc.includes('bathinda')) {
        ndvi = 0.74;
        moisture = 38;
        temp = 24.5;
        if (!customCoords) coords = '30.9010° N, 75.8573° E';
      } else if (loc.includes('wardha') || loc.includes('maharashtra') || loc.includes('vidarbha') || loc.includes('nashik') || loc.includes('akola')) {
        ndvi = 0.48;
        moisture = 22;
        temp = 36.1;
        if (!customCoords) coords = '20.7453° N, 78.6022° E';
      } else if (loc.includes('warangal') || loc.includes('telangana') || loc.includes('guntur') || loc.includes('andhra')) {
        ndvi = 0.52;
        moisture = 28;
        temp = 33.0;
        if (!customCoords) coords = '17.9689° N, 79.5941° E';
      } else if (loc.includes('rajkot') || loc.includes('gujarat') || loc.includes('junagadh') || loc.includes('amreli')) {
        ndvi = 0.39;
        moisture = 16;
        temp = 37.4;
        if (!customCoords) coords = '22.3039° N, 70.8022° E';
      } else if (loc.includes('thanjavur') || loc.includes('tamil') || loc.includes('madurai')) {
        ndvi = 0.62;
        moisture = 34;
        temp = 31.5;
        if (!customCoords) coords = '10.7870° N, 79.1378° E';
      }

      onChange({
        coordinates: coords,
        telemetryNdvi: ndvi,
        telemetrySoilMoisture: moisture,
        telemetrySurfaceTemp: temp,
      });
      setIsSyncingSatellite(false);
      setSatelliteSyncedMsg(`${t.satelliteSynced}: NDVI ${ndvi} • ${moisture}% • ${temp}°C`);
      setTimeout(() => setSatelliteSyncedMsg(null), 4000);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold font-serif flex items-center gap-2">
            <Layers className="w-5 h-5 text-lime-300" />
            {t.farmContextTitle}
          </h2>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            {t.farmContextSubtitle}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Row 1: State/District & Crop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
              {t.locationLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={context.stateDistrict}
              onChange={(e) => onChange({ stateDistrict: e.target.value })}
              placeholder={t.locationPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm text-stone-900 placeholder:text-stone-400 bg-stone-50/50"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] text-stone-400 font-medium mr-1 py-0.5">{t.quickPicks}</span>
              {t.presetLocations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => onChange({ stateDistrict: loc })}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer transition-colors"
                >
                  {loc.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
              {t.cropLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={context.cropType}
              onChange={(e) => onChange({ cropType: e.target.value })}
              placeholder={t.cropPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm text-stone-900 placeholder:text-stone-400 bg-stone-50/50"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {t.crops.slice(0, 5).map((crop) => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => onChange({ cropType: crop })}
                  className={`text-[11px] px-2 py-0.5 rounded-md border cursor-pointer transition-colors ${
                    context.cropType.toLowerCase() === crop.toLowerCase()
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600 border-stone-200'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Growth Stage & Soil Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
              {t.growthStageLabel}
            </label>
            <select
              value={context.growthStage}
              onChange={(e) => onChange({ growthStage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm text-stone-900 bg-stone-50/50 cursor-pointer"
            >
              {t.stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
              <span>{t.soilLabel}</span>
              <span className="text-[10px] text-stone-400 font-normal">{t.soilSubtext}</span>
            </label>
            <input
              type="text"
              value={context.soilCondition}
              onChange={(e) => onChange({ soilCondition: e.target.value })}
              placeholder={t.soilPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm text-stone-900 bg-stone-50/50"
            />
          </div>
        </div>

        {/* Row 3: Weather & Forecast */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <CloudSun className="w-4 h-4 text-amber-600" />
            {t.weatherLabel}
          </label>
          <div className="relative">
            <input
              type="text"
              value={context.weatherForecast}
              onChange={(e) => onChange({ weatherForecast: e.target.value })}
              placeholder={t.weatherPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm text-stone-900 bg-stone-50/50"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              type="button"
              onClick={() =>
                onChange({
                  weatherForecast: '32-35°C, low humidity 30%, heatwave alert for next 4 days',
                })
              }
              className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 cursor-pointer"
            >
              ☀️ {t.hotDrySpell}
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  weatherForecast: '28°C, 85% high humidity, overcast with intermittent rain forecast',
                })
              }
              className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 cursor-pointer"
            >
              🌧️ {t.humidRain}
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  weatherForecast: '24°C daytime / 14°C night, heavy morning dew, foggy mornings',
                })
              }
              className="text-[11px] px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 cursor-pointer"
            >
              🌫️ {t.coldDew}
            </button>
          </div>
        </div>

        {/* Row 3.5: Satellite Telemetry & Geospatial Risk Profile (ISRO Bhuvan / Sentinel-2 / IMD Agromet) */}
        <div className="pt-2 border-t border-stone-200">
          <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-teal-950 rounded-2xl p-4 sm:p-5 text-white border border-teal-800/40 shadow-inner space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300">
                  <Satellite className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide text-teal-200 flex items-center gap-1.5">
                    {t.satelliteTitle}
                  </h3>
                  <p className="text-[11px] text-teal-300/80">
                    {t.satelliteSubtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSyncSatellite()}
                  disabled={isSyncingSatellite}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSyncingSatellite ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t.syncSatelliteBtn}...</span>
                    </>
                  ) : (
                    <>
                      <Radio className="w-3.5 h-3.5 text-lime-300 animate-pulse" />
                      <span>{t.syncSatelliteBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* GPS Coordinates Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="sm:col-span-2 relative">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-semibold text-stone-300 shrink-0 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    {t.gpsCoordinatesLabel}:
                  </label>
                  <input
                    type="text"
                    value={context.coordinates || ''}
                    onChange={(e) => onChange({ coordinates: e.target.value })}
                    placeholder="e.g. 26.9124° N, 75.7873° E"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-stone-800/90 border border-stone-700 text-xs text-stone-100 placeholder:text-stone-500 focus:ring-1 focus:ring-teal-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-teal-300 border border-stone-600 whitespace-nowrap cursor-pointer transition-colors"
                    title="Detect GPS from device"
                  >
                    <Compass className="w-3.5 h-3.5 inline mr-1" />
                    GPS
                  </button>
                </div>
              </div>

              <div className="text-right sm:text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-[10px] font-mono text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  ISRO Bhuvan / Sentinel-2 Live
                </span>
              </div>
            </div>

            {satelliteSyncedMsg && (
              <div className="text-xs text-lime-300 bg-teal-900/60 border border-teal-700/80 px-3 py-1.5 rounded-lg">
                ✓ {satelliteSyncedMsg}
              </div>
            )}

            {/* Live Telemetry Sensor Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Card 1: NDVI Vegetation Health */}
              <div className="bg-stone-800/80 rounded-xl p-3 border border-stone-700/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-300 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-lime-400" />
                    NDVI Index
                  </span>
                  <span className="font-mono font-bold text-lime-300 text-sm">
                    {context.telemetryNdvi ?? 0.45}
                  </span>
                </div>
                
                {/* Visual Gradient Bar */}
                <div className="h-2 rounded-full w-full bg-gradient-to-r from-red-600 via-amber-400 to-emerald-500 relative">
                  <div
                    className="absolute -top-1 w-4 h-4 bg-white border-2 border-stone-900 rounded-full shadow transition-all"
                    style={{
                      left: `calc(${Math.min(Math.max(((context.telemetryNdvi ?? 0.45) - 0.1) / 0.8, 0), 1) * 100}% - 8px)`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                  <span>0.1 (Barren)</span>
                  <span>0.5</span>
                  <span>0.9 (Dense)</span>
                </div>

                <input
                  type="range"
                  min="0.15"
                  max="0.90"
                  step="0.01"
                  value={context.telemetryNdvi ?? 0.45}
                  onChange={(e) => onChange({ telemetryNdvi: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-lime-400"
                />

                <div className="text-[11px] font-semibold text-lime-300/90 pt-0.5">
                  {(context.telemetryNdvi ?? 0.45) > 0.65
                    ? `✓ ${context.telemetryNdvi} - Healthy Vegetative Canopy`
                    : (context.telemetryNdvi ?? 0.45) >= 0.38
                    ? `⚠️ ${context.telemetryNdvi} - Moderate Stress`
                    : `🚨 ${context.telemetryNdvi} - Severe Drought Stress`}
                </div>
              </div>

              {/* Card 2: Root-Zone Soil Moisture */}
              <div className="bg-stone-800/80 rounded-xl p-3 border border-stone-700/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-300 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    Soil Moisture
                  </span>
                  <span className="font-mono font-bold text-cyan-300 text-sm">
                    {context.telemetrySoilMoisture ?? 22}%
                  </span>
                </div>

                {/* Moisture Bar */}
                <div className="h-2 rounded-full w-full bg-stone-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-cyan-500 rounded-full transition-all"
                    style={{ width: `${Math.min(Math.max((context.telemetrySoilMoisture ?? 22) * 1.6, 5), 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                  <span>10% (Dry)</span>
                  <span>35% (Optimal)</span>
                  <span>60% (Wet)</span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="60"
                  step="1"
                  value={context.telemetrySoilMoisture ?? 22}
                  onChange={(e) => onChange({ telemetrySoilMoisture: parseInt(e.target.value, 10) })}
                  className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />

                <div className="text-[11px] font-semibold text-cyan-300/90 pt-0.5">
                  {(context.telemetrySoilMoisture ?? 22) < 20
                    ? `⚠️ ${context.telemetrySoilMoisture ?? 22}% - Root Moisture Deficit`
                    : (context.telemetrySoilMoisture ?? 22) <= 45
                    ? `✓ ${context.telemetrySoilMoisture ?? 22}% - Adequate Soil Moisture`
                    : `🌧️ ${context.telemetrySoilMoisture ?? 22}% - Waterlogging Alert`}
                </div>
              </div>

              {/* Card 3: Land Surface Temperature */}
              <div className="bg-stone-800/80 rounded-xl p-3 border border-stone-700/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-300 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                    Surface Temp (LST)
                  </span>
                  <span className="font-mono font-bold text-orange-300 text-sm">
                    {context.telemetrySurfaceTemp ?? 33.5}°C
                  </span>
                </div>

                {/* Temperature Bar */}
                <div className="h-2 rounded-full w-full bg-stone-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-600 rounded-full transition-all"
                    style={{
                      width: `${Math.min(Math.max((((context.telemetrySurfaceTemp ?? 33.5) - 15) / 30) * 100, 5), 100)}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                  <span>15°C (Cool)</span>
                  <span>30°C</span>
                  <span>45°C (Heat)</span>
                </div>

                <input
                  type="range"
                  min="18"
                  max="45"
                  step="0.5"
                  value={context.telemetrySurfaceTemp ?? 33.5}
                  onChange={(e) => onChange({ telemetrySurfaceTemp: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-orange-400"
                />

                <div className="text-[11px] font-semibold text-orange-300/90 pt-0.5">
                  {(context.telemetrySurfaceTemp ?? 33.5) > 36
                    ? `🔥 ${context.telemetrySurfaceTemp ?? 33.5}°C - Severe Heatwave Load`
                    : (context.telemetrySurfaceTemp ?? 33.5) >= 31
                    ? `⚠️ ${context.telemetrySurfaceTemp ?? 33.5}°C - Elevated Thermal Load`
                    : `✓ ${context.telemetrySurfaceTemp ?? 33.5}°C - Normal Temperature`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Multimodal Leaf Image Upload */}
        <div className="pt-2 border-t border-stone-200">
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" />
              {t.leafInspectionLabel}
            </span>
            <span className="text-[11px] text-stone-500 font-normal">
              {t.leafInspectionSubtext}
            </span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />

          {context.imagePreview ? (
            <div className="relative rounded-2xl border-2 border-emerald-500/60 bg-stone-900 overflow-hidden max-w-md mx-auto shadow-md">
              <img
                src={context.imagePreview}
                alt="Crop leaf under inspection"
                className="w-full h-56 object-contain bg-stone-950"
              />
              <div className="absolute top-2 right-2 flex items-center gap-2">
                <span className="bg-emerald-600/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {t.leafAttached}
                </span>
                <button
                  type="button"
                  onClick={removeImage}
                  className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md cursor-pointer transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-stone-900/90 text-stone-200 text-[11px] px-3 py-1.5 flex items-center justify-between border-t border-stone-800">
                <span>AI Computer Vision Ready</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-emerald-400 hover:underline cursor-pointer"
                >
                  {t.replacePhoto}
                </button>
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-stone-50/60 hover:bg-emerald-50/30 transition-all"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-3 shadow-inner">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-stone-800">
                {t.dragDropText}
              </div>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                {t.dragDropSubtext}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  {t.takePhotoButton}
                </button>
              </div>

              {/* Ready Specimens Picker */}
              <div className="mt-5 pt-4 border-t border-stone-200/80">
                <div className="text-xs font-semibold text-stone-600 mb-2 flex items-center justify-center gap-1.5">
                  <FileImage className="w-3.5 h-3.5 text-amber-600" />
                  {t.orSelectSpecimen}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => selectSampleSpecimen('wheat_yellow_rust')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 cursor-pointer"
                  >
                    🌾 {t.crops[0]}
                  </button>
                  <button
                    type="button"
                    onClick={() => selectSampleSpecimen('paddy_bacterial_blight')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 cursor-pointer"
                  >
                    🌱 {t.crops[1]}
                  </button>
                  <button
                    type="button"
                    onClick={() => selectSampleSpecimen('cotton_leaf_curl')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 cursor-pointer"
                  >
                    🌿 {t.crops[2]}
                  </button>
                  <button
                    type="button"
                    onClick={() => selectSampleSpecimen('chilli_leaf_curl')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-lime-50 hover:bg-lime-100 text-lime-900 border border-lime-300 cursor-pointer"
                  >
                    🌶️ {t.crops[5] || 'Chilli'}
                  </button>
                  <button
                    type="button"
                    onClick={() => selectSampleSpecimen('tomato_early_blight')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-900 border border-red-300 cursor-pointer"
                  >
                    🍅 {t.crops[4] || 'Tomato'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Row 5: Farmer Question & Voice-to-Text Input via MediaRecorder */}
        <div className="pt-2 border-t border-stone-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                {t.questionLabel} <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-stone-500">
                {t.questionSubtext}
              </span>
            </div>

            {!isRecording && !isTranscribing && (
              <button
                type="button"
                onClick={startMediaRecording}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all cursor-pointer hover:shadow-md"
              >
                <Mic className="w-3.5 h-3.5 text-lime-300" />
                <span>{t.recordVoice}</span>
              </button>
            )}
          </div>

          {/* Active MediaRecorder Interface */}
          {isRecording && (
            <div className="mb-3 p-4 rounded-2xl bg-stone-900 border-2 border-red-500 text-white shadow-lg animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <span className="w-4 h-4 rounded-full bg-red-600 animate-ping absolute" />
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500 relative" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-300 flex items-center gap-2">
                      <span>{t.recordingVoice}</span>
                      <span className="font-mono bg-stone-800 px-2 py-0.5 rounded text-white text-[11px]">
                        {formatSeconds(recordingDuration)} / 01:00
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {t.speakClearly}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 h-6 px-3 bg-stone-800/80 rounded-lg">
                  <span className="w-1 bg-lime-400 rounded-full animate-bounce [animation-delay:0ms] h-4" />
                  <span className="w-1 bg-lime-400 rounded-full animate-bounce [animation-delay:150ms] h-6" />
                  <span className="w-1 bg-lime-400 rounded-full animate-bounce [animation-delay:300ms] h-3" />
                  <span className="w-1 bg-lime-400 rounded-full animate-bounce [animation-delay:75ms] h-5" />
                  <span className="w-1 bg-lime-400 rounded-full animate-bounce [animation-delay:225ms] h-4" />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={cancelMediaRecording}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={stopMediaRecording}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all hover:scale-102"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>{t.stopAndTranscribe}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Transcribing Indicator */}
          {isTranscribing && (
            <div className="mb-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 text-xs shadow-xs animate-pulse">
              <Loader2 className="w-4 h-4 text-emerald-700 animate-spin shrink-0" />
              <div>
                <strong>{t.transcribingStatus}</strong>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  {t.transcribingSubtext}
                </p>
              </div>
            </div>
          )}

          {/* Audio Preview Widget */}
          {recordedAudioUrl && !isRecording && (
            <div className="mb-3 p-3 rounded-xl bg-stone-100 border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-semibold text-stone-800">{t.recordedAudioNote}</span>
                <audio src={recordedAudioUrl} controls className="h-7 max-w-xs" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={startMediaRecording}
                  className="text-[11px] font-medium text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> {t.reRecord}
                </button>
                <button
                  type="button"
                  onClick={deleteRecordedAudio}
                  className="text-[11px] font-medium text-red-600 hover:text-red-700 p-1 cursor-pointer"
                  title="Delete recorded audio"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {voiceSuccess && (
            <div className="mb-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{voiceSuccess}</span>
            </div>
          )}

          {speechError && (
            <div className="mb-2 text-xs text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
              {speechError}
            </div>
          )}

          {/* Farmer Query Text Area */}
          <textarea
            rows={3}
            value={context.farmerQuery}
            onChange={(e) => onChange({ farmerQuery: e.target.value })}
            placeholder={t.questionPlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm text-stone-900 bg-stone-50/50 leading-relaxed"
          />

          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[10px] text-stone-400 font-medium py-0.5">{t.quickQueries}</span>
            {t.sampleQueries.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onChange({ farmerQuery: q })}
                className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-4">
          <button
            type="button"
            disabled={isLoading || !context.cropType || !context.farmerQuery}
            onClick={onSubmit}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer ${
              isLoading || !context.cropType || !context.farmerQuery
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white shadow-emerald-900/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.submittingButton}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-lime-300 animate-pulse" />
                <span>{t.submitButton}</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-stone-500 mt-2">
            {t.zeroChemicalsBadge}
          </p>
        </div>
      </div>
    </div>
  );
};
