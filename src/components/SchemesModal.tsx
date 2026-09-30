import React from 'react';
import { X, ShieldCheck, PhoneCall } from 'lucide-react';
import { LanguageCode } from '../types';

interface SchemesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
}

const SCHEMES = [
  {
    title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    hindiTitle: 'परम्परागत कृषि विकास योजना',
    focus: 'Organic Farming & Regenerative Bio-Inputs',
    financialAssistance: '₹50,000 per hectare over 3 years (₹31,000 directly for organic inputs/seeds/bio-pesticides)',
    howToApply: 'Form a cluster of 20-50 farmers or register via District Agriculture Office / PGS-India portal.',
    helpline: '1800-180-1551 (KCC) • pgsorganic-mowr.gov.in',
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    hindiTitle: 'प्रधानमंत्री फसल बीमा योजना',
    focus: 'Crop Loss & Pest Infestation Insurance',
    financialAssistance: 'Non-preventable localized risk coverage; low premium (1.5% Rabi crops, 2.0% Kharif crops, 5% commercial/horticultural).',
    howToApply: 'Intimate crop damage within 72 hours via the Crop Insurance App or Bank/CSC center.',
    helpline: 'Toll-Free PMFBY: 1800-180-2117 / 14447 • pmfby.gov.in',
  },
  {
    title: 'Soil Health Card Scheme (SHC)',
    hindiTitle: 'मृदा स्वास्थ्य कार्ड योजना',
    focus: 'Soil Nutrient & Micro-Nutrient Status',
    financialAssistance: 'Free testing of 12 soil parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, Organic Carbon).',
    howToApply: 'Contact local Gram Panchayat or Village Agricultural Assistant to collect soil samples.',
    helpline: 'soilhealth.dac.gov.in',
  },
  {
    title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    hindiTitle: 'कृषि यंत्रीकरण उप-मिशन',
    focus: 'Bio-sprayers, Knapsack Drones & Farm Equipment',
    financialAssistance: '40% to 50% subsidy on battery-operated sprayers, rotavators, and mulchers for small/marginal farmers.',
    howToApply: 'Apply through DBT in Agriculture Mechanization Portal (agrimachinery.nic.in).',
    helpline: 'agrimachinery.nic.in',
  },
];

export const SchemesModal: React.FC<SchemesModalProps> = ({ isOpen, onClose, currentLanguage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif">
                {currentLanguage === 'en' ? 'Indian Farmer Welfare & Crop Support Directory' : 'किसान कल्याण व सरकारी सहायता निर्देशिका'}
              </h3>
              <p className="text-xs text-emerald-200/80">
                {currentLanguage === 'en' ? 'Official Government schemes, subsidies, and emergency crop insurance helplines' : 'आधिकारिक सरकारी योजनाएं, अनुदान एवं फसल बीमा हेल्पलाइन'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-950 flex items-center gap-3">
            <PhoneCall className="w-6 h-6 text-amber-700 shrink-0" />
            <div>
              <strong className="block text-sm font-bold text-amber-900">
                {currentLanguage === 'en' ? 'National Kisan Call Centre (24x7 In 22 Indian Languages)' : 'राष्ट्रीय किसान कॉल सेंटर (२४x७ निःशुल्क सहायता)'}
              </strong>
              {currentLanguage === 'en' ? 'Dial Toll-Free 1800-180-1551 for immediate free consultation with certified agricultural scientists.' : 'प्रमाणित कृषि वैज्ञानिकों से निःशुल्क सलाह हेतु टोल-फ्री १८००-१८०-१५५१ पर कॉल करें।'}
            </div>
          </div>

          <div className="space-y-4">
            {SCHEMES.map((scheme, idx) => {
              const scTitle = currentLanguage === 'en' ? scheme.title : (scheme.hindiTitle || scheme.title);
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-base font-bold text-stone-900 font-serif">
                      {scTitle}
                    </h4>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {scheme.focus}
                    </span>
                  </div>

                <div className="text-stone-700">
                  <strong className="text-stone-900">Financial Assistance / Benefit:</strong>{' '}
                  {scheme.financialAssistance}
                </div>

                <div className="text-stone-700">
                  <strong className="text-stone-900">How to Apply:</strong> {scheme.howToApply}
                </div>

                <div className="pt-2 border-t border-stone-200 text-[11px] font-mono text-stone-600 flex items-center justify-between">
                  <span>Helpline / Portal: <strong>{scheme.helpline}</strong></span>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-100 border-t border-stone-200 px-6 py-3 flex items-center justify-between text-xs text-stone-500">
          <span>Source: Ministry of Agriculture & Farmers Welfare, Government of India</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 text-white font-medium hover:bg-stone-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
