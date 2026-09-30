import React from 'react';
import { Sprout, PhoneCall, Globe2, ShieldCheck, BookOpen } from 'lucide-react';
import { LanguageCode } from '../types';
import { LANGUAGES } from '../data/presets';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenRecipes: () => void;
  onOpenSchemes: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenRecipes,
  onOpenSchemes,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  return (
    <header className="bg-stone-900 border-b border-stone-800 text-stone-100 sticky top-0 z-30 shadow-md">
      {/* Top emergency & digital public good marquee/banner */}
      <div className="bg-emerald-900/90 border-b border-emerald-800/80 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            {t.bricsBanner}
          </span>
          <span className="hidden sm:inline text-emerald-100/90 font-medium">
            {t.digitalPublicGood}
          </span>
        </div>
        <div className="flex items-center gap-3 text-emerald-100 font-medium ml-auto">
          <a
            href="tel:18001801551"
            className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-700/60"
          >
            <PhoneCall className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>{t.kisanCallCenter}: <strong>1800-180-1551</strong> ({t.tollFree})</span>
          </a>
        </div>
      </div>

      {/* Main navigation & language switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-600 flex items-center justify-center shadow-lg shadow-emerald-950/40 text-stone-950">
            <Sprout className="w-6 h-6 text-stone-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-white">
                {t.appTitle} <span className="text-lime-400 font-sans text-sm font-semibold px-2 py-0.5 bg-lime-950/70 border border-lime-800/80 rounded-md">{t.versionBadge}</span>
              </h1>
            </div>
            <p className="text-xs text-stone-400 font-normal">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
          {/* Quick knowledge buttons */}
          <button
            onClick={onOpenRecipes}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-all cursor-pointer hover:border-emerald-500/50"
          >
            <BookOpen className="w-3.5 h-3.5 text-lime-400" />
            <span>{t.bioHandbook}</span>
          </button>

          <button
            onClick={onOpenSchemes}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-all cursor-pointer hover:border-emerald-500/50"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.govtSchemes}</span>
          </button>

          {/* Regional Language Picker */}
          <div className="flex items-center gap-1.5 bg-stone-800/90 border border-stone-700 px-2 py-1 rounded-lg">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-transparent text-xs font-medium text-stone-100 focus:outline-none cursor-pointer py-1 pr-1"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-stone-900 text-stone-100">
                  {lang.nativeLabel}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
