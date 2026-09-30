import React, { useState } from 'react';
import { X, BookOpen, Clock, Check, Droplet, Sparkles } from 'lucide-react';
import { ORGANIC_RECIPES } from '../data/recipes';
import { LanguageCode } from '../types';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose, currentLanguage }) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState(ORGANIC_RECIPES[0].id);

  if (!isOpen) return null;

  const currentRecipe = ORGANIC_RECIPES.find((r) => r.id === selectedRecipeId) || ORGANIC_RECIPES[0];
  const recipeTitle = currentLanguage === 'en' ? currentRecipe.name : (currentRecipe.hindiName || currentRecipe.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lime-500/20 text-lime-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif">
                Regenerative Bio-Formulation Handbook
              </h3>
              <p className="text-xs text-stone-400">
                Traditional zero-budget natural farming recipes using on-farm materials
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

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* List of recipes */}
          <div className="space-y-2 border-r border-stone-200 md:pr-4">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">
              Select Formulation:
            </div>
            {ORGANIC_RECIPES.map((recipe) => {
              const isSelected = recipe.id === currentRecipe.id;
              return (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">
                    {currentLanguage === 'en' ? recipe.name.split('(')[0] : (recipe.hindiName.split('(')[0] || recipe.name.split('(')[0])}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details of chosen recipe */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-lime-100 text-lime-900">
                100% Organic & Non-Toxic
              </span>
              <h4 className="text-xl font-bold font-serif text-stone-900 mt-1">
                {recipeTitle}
              </h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {currentRecipe.purpose}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                Shelf Life: <strong>{currentRecipe.shelfLife}</strong>
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Droplet className="w-3.5 h-3.5 text-emerald-600" />
                Method: <strong>Foliar & Soil Inoculant</strong>
              </span>
            </div>

            {/* Ingredients */}
            <div>
              <h5 className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                Ingredients & Quantities:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {currentRecipe.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="text-xs bg-emerald-50/60 border border-emerald-100 rounded-lg p-2 text-stone-800 flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{ing}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Steps */}
            <div>
              <h5 className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                Step-by-Step Preparation:
              </h5>
              <ol className="space-y-1.5">
                {currentRecipe.preparationSteps.map((step, si) => (
                  <li key={si} className="text-xs text-stone-700 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {si + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Dosage & Target */}
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 text-xs text-amber-950 space-y-1">
              <div>
                <strong>Dosage & Spray Schedule:</strong> {currentRecipe.dosage}
              </div>
              <div className="text-[11px] text-amber-800">
                <strong>Targets:</strong> {currentRecipe.targetPestsOrDiseases.join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-100 border-t border-stone-200 px-6 py-3 flex items-center justify-between text-xs text-stone-500">
          <span>Sourced from Indian Council of Agricultural Research (ICAR) & Subhash Palekar Natural Farming (SPNF) literature</span>
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
