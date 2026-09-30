import React from 'react';
import { getPresetsForLanguage } from '../data/presets';
import { PresetScenario, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Sparkles, MapPin } from 'lucide-react';

interface PresetBarProps {
  currentLanguage: LanguageCode;
  onSelectPreset: (preset: PresetScenario) => void;
  selectedPresetId?: string;
}

export const PresetBar: React.FC<PresetBarProps> = ({
  currentLanguage,
  onSelectPreset,
  selectedPresetId,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const presets = getPresetsForLanguage(currentLanguage);

  return (
    <div className="bg-amber-100/60 border border-amber-200/80 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-semibold text-stone-800 uppercase tracking-wide">
            {t.oneClickScenarios}
          </span>
        </div>
        <span className="text-[11px] text-stone-500 font-medium hidden sm:inline">
          {t.tapToPopulate}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {presets.map((scenario) => {
          const isSelected = selectedPresetId === scenario.id;
          return (
            <button
              key={scenario.id}
              onClick={() => onSelectPreset(scenario)}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-500/40'
                  : 'bg-white hover:bg-emerald-50/80 text-stone-800 border-stone-200 hover:border-emerald-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-emerald-950/70 text-emerald-200'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {scenario.badge}
                  </span>
                </div>
                <div className={`text-xs font-bold leading-snug line-clamp-1 ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                  {scenario.crop}
                </div>
                <div className={`text-[11px] flex items-center gap-1 mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}>
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{scenario.location}</span>
                </div>
              </div>

              <div
                className={`text-[11px] mt-2 pt-1.5 border-t line-clamp-2 italic ${
                  isSelected ? 'border-emerald-700/60 text-emerald-100' : 'border-stone-100 text-stone-600'
                }`}
              >
                "{scenario.query}"
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
