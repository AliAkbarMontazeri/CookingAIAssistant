import React from 'react';
import type { Recipe } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { UsersIcon } from './icons/UsersIcon';
import { LinkIcon } from './icons/LinkIcon';

interface RecipeCardProps {
  recipe: Recipe;
  translations: {
    recipeCard: {
      prepTime: string;
      cookTime: string;
      servings: string;
      ingredients: string;
      instructions: string;
      tip: string;
      sources: string;
    }
  };
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, translations }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 md:p-8">
        <h3 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">{recipe.title}</h3>
        <p className="text-stone-600 mb-6">{recipe.description}</p>

        <div className="flex flex-wrap gap-4 md:gap-8 mb-6 text-stone-700">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-emerald-500" />
            <div>
              <span className="font-semibold block text-sm">{translations.recipeCard.prepTime}</span>
              <span className="text-sm">{recipe.prepTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-emerald-500" />
            <div>
              <span className="font-semibold block text-sm">{translations.recipeCard.cookTime}</span>
              <span className="text-sm">{recipe.cookTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-emerald-500" />
            <div>
              <span className="font-semibold block text-sm">{translations.recipeCard.servings}</span>
              <span className="text-sm">{recipe.servings}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h4 className="text-xl font-bold text-stone-700 mb-4 border-b-2 border-emerald-500 pb-2">{translations.recipeCard.ingredients}</h4>
            <ul className="list-disc list-inside space-y-2 text-stone-600">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-xl font-bold text-stone-700 mb-4 border-b-2 border-emerald-500 pb-2">{translations.recipeCard.instructions}</h4>
            <ol className="list-decimal list-inside space-y-4 text-stone-600">
              {recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        {recipe.tip && (
          <div className="mt-8 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
            <h5 className="font-bold text-emerald-800">{translations.recipeCard.tip}</h5>
            <p className="text-emerald-700 text-sm mt-1">{recipe.tip}</p>
          </div>
        )}

        {recipe.sourceUrls && recipe.sourceUrls.length > 0 && (
          <div className="mt-8">
            <h4 className="flex items-center gap-2 text-lg font-bold text-stone-700 mb-3">
              <LinkIcon className="w-5 h-5" />
              {translations.recipeCard.sources}
            </h4>
            <ul className="space-y-1">
              {recipe.sourceUrls.map((url, index) => (
                <li key={index}>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-600 hover:text-emerald-800 hover:underline break-all text-sm"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
