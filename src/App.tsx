import React, { useState } from 'react';
import { Header } from './components/Header';
import { PresetBar } from './components/PresetBar';
import { FarmerForm } from './components/FarmerForm';
import { AdvisoryReportView } from './components/AdvisoryReportView';
import { RecipeModal } from './components/RecipeModal';
import { SchemesModal } from './components/SchemesModal';
import { FarmContext, AdvisoryReport, LanguageCode, PresetScenario } from './types';
import { SAMPLE_LEAF_IMAGES, getPresetsForLanguage } from './data/presets';
import { TRANSLATIONS } from './data/translations';
import { rasterizeSvgToPng } from './utils/imageUtils';
import {
  Sprout,
  ShieldCheck,
  Award,
  Leaf,
  Globe2,
  AlertCircle,
} from 'lucide-react';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('hi');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('jaipur-wheat');

  const initialPresets = getPresetsForLanguage('hi');
  const initialPreset = initialPresets[0];

  // Initial farm context in active language
  const [farmContext, setFarmContext] = useState<FarmContext>({
    stateDistrict: initialPreset.location,
    cropType: initialPreset.crop,
    growthStage: initialPreset.stage,
    soilCondition: initialPreset.soil,
    weatherForecast: initialPreset.weather,
    farmerQuery: initialPreset.query,
    language: 'hi',
    imageBase64: SAMPLE_LEAF_IMAGES['wheat_yellow_rust'],
    imagePreview: SAMPLE_LEAF_IMAGES['wheat_yellow_rust'],
    coordinates: initialPreset.coordinates || '26.9124° N, 75.7873° E',
    telemetryNdvi: initialPreset.telemetryNdvi ?? 0.42,
    telemetrySoilMoisture: initialPreset.telemetrySoilMoisture ?? 19,
    telemetrySurfaceTemp: initialPreset.telemetrySurfaceTemp ?? 34.2,
  });

  const [report, setReport] = useState<AdvisoryReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showRecipesModal, setShowRecipesModal] = useState<boolean>(false);
  const [showSchemesModal, setShowSchemesModal] = useState<boolean>(false);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Language switch handler: dynamically converts all fields & presets to the single chosen language
  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    const presetsForLang = getPresetsForLanguage(lang);
    const matchingPreset = presetsForLang.find((p) => p.id === selectedPresetId) || presetsForLang[0];

    if (matchingPreset) {
      setFarmContext((prev) => ({
        ...prev,
        stateDistrict: matchingPreset.location,
        cropType: matchingPreset.crop,
        growthStage: matchingPreset.stage,
        soilCondition: matchingPreset.soil,
        weatherForecast: matchingPreset.weather,
        farmerQuery: matchingPreset.query,
        coordinates: matchingPreset.coordinates || prev.coordinates,
        telemetryNdvi: matchingPreset.telemetryNdvi ?? prev.telemetryNdvi,
        telemetrySoilMoisture: matchingPreset.telemetrySoilMoisture ?? prev.telemetrySoilMoisture,
        telemetrySurfaceTemp: matchingPreset.telemetrySurfaceTemp ?? prev.telemetrySurfaceTemp,
        language: lang,
      }));
    } else {
      setFarmContext((prev) => ({ ...prev, language: lang }));
    }
  };

  // Context update helper
  const handleContextChange = (updated: Partial<FarmContext>) => {
    setFarmContext((prev) => ({ ...prev, ...updated }));
  };

  // Preset selector
  const handleSelectPreset = async (preset: PresetScenario) => {
    setSelectedPresetId(preset.id);
    const specimen = preset.imageSampleKey ? SAMPLE_LEAF_IMAGES[preset.imageSampleKey] : undefined;
    const rasterized = await rasterizeSvgToPng(specimen);
    setFarmContext({
      stateDistrict: preset.location,
      cropType: preset.crop,
      growthStage: preset.stage,
      soilCondition: preset.soil,
      weatherForecast: preset.weather,
      farmerQuery: preset.query,
      language: currentLanguage,
      imageBase64: rasterized || specimen,
      imagePreview: specimen,
      coordinates: preset.coordinates || '26.9124° N, 75.7873° E',
      telemetryNdvi: preset.telemetryNdvi ?? 0.45,
      telemetrySoilMoisture: preset.telemetrySoilMoisture ?? 22,
      telemetrySurfaceTemp: preset.telemetrySurfaceTemp ?? 33.0,
    });
    setReport(null);
    setError(null);
  };

  // Submit diagnostic request
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let payloadImage = farmContext.imageBase64;
      let payloadMime = 'image/jpeg';

      if (payloadImage) {
        if (payloadImage.includes('image/svg')) {
          const pngData = await rasterizeSvgToPng(payloadImage);
          if (pngData && pngData.startsWith('data:image/png')) {
            payloadImage = pngData;
            payloadMime = 'image/png';
          }
        } else if (payloadImage.startsWith('data:image/png')) {
          payloadMime = 'image/png';
        } else if (payloadImage.startsWith('data:image/webp')) {
          payloadMime = 'image/webp';
        }
      }

      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stateDistrict: farmContext.stateDistrict,
          cropType: farmContext.cropType,
          growthStage: farmContext.growthStage,
          soilCondition: farmContext.soilCondition,
          weatherForecast: farmContext.weatherForecast,
          farmerQuery: farmContext.farmerQuery,
          language: farmContext.language,
          imageBase64: payloadImage,
          mimeType: payloadMime,
          coordinates: farmContext.coordinates,
          telemetryNdvi: farmContext.telemetryNdvi,
          telemetrySoilMoisture: farmContext.telemetrySoilMoisture,
          telemetrySurfaceTemp: farmContext.telemetrySurfaceTemp,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data: AdvisoryReport = await response.json();
      setReport(data);

      window.scrollTo({ top: 380, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      setError(err.message || 'Failed to generate advisory. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-amber-50/40 text-stone-900">
      {/* Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onOpenRecipes={() => setShowRecipesModal(true)}
        onOpenSchemes={() => setShowSchemesModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Hero Mission Intro */}
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-600/50 px-3 py-1 rounded-full text-xs font-semibold text-lime-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.heroBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-light">
              {t.heroDescription}
            </p>
          </div>
        </div>

        {/* 1-Click Preset Scenarios Bar (Only shows active language) */}
        <PresetBar
          currentLanguage={currentLanguage}
          onSelectPreset={handleSelectPreset}
          selectedPresetId={selectedPresetId}
        />

        {/* Error notification if any */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-900 text-sm shadow-xs">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Error</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Either show Report if generated, or the Form */}
        {report ? (
          <AdvisoryReportView
            report={report}
            context={farmContext}
            onReset={handleReset}
            onOpenRecipes={() => setShowRecipesModal(true)}
          />
        ) : (
          <FarmerForm
            context={farmContext}
            onChange={handleContextChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}

        {/* Digital Public Good Pillars & Standards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                {t.pillar1Title}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {t.pillar1Desc}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                {t.pillar2Title}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {t.pillar2Desc}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                {t.pillar3Title}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {t.pillar3Desc}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 mt-12 py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-200 font-bold">
              <Sprout className="w-4 h-4 text-lime-400" />
              <span>{t.footerTitle}</span>
            </div>
            <p className="text-stone-400 text-[11px]">
              {t.footerDesc}
            </p>
          </div>

          <div className="flex items-center gap-4 text-stone-400 text-[11px]">
            <span>{t.kisanCallCenter}: 1800-180-1551</span>
            <span>•</span>
            <span>PMFBY Helpline: 1800-180-2117</span>
            <span>•</span>
            <span>ICAR & KVK Network Supported</span>
          </div>
        </div>
      </footer>

      {/* Bio-Formulation Handbook Modal */}
      <RecipeModal
        isOpen={showRecipesModal}
        onClose={() => setShowRecipesModal(false)}
        currentLanguage={currentLanguage}
      />

      {/* Government Schemes & Crop Insurance Modal */}
      <SchemesModal
        isOpen={showSchemesModal}
        onClose={() => setShowSchemesModal(false)}
        currentLanguage={currentLanguage}
      />
    </div>
  );
}
