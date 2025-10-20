
import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface IngredientInputProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (index: number) => void;
  translations: {
    ingredientPlaceholder: string;
    addIngredientLabel: string;
    removeIngredientLabel: string;
  }
}

export const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, onAddIngredient, onRemoveIngredient, translations }) => {
  const [currentIngredient, setCurrentIngredient] = useState('');

  const handleAdd = () => {
    if (currentIngredient.trim()) {
      onAddIngredient(currentIngredient.trim().toLowerCase());
      setCurrentIngredient('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 border-2 border-stone-200 rounded-full p-2 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 transition-all duration-300">
        <input
          type="text"
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={translations.ingredientPlaceholder}
          className="flex-grow bg-transparent border-none focus:ring-0 outline-none px-4 text-stone-700 placeholder-stone-400"
        />
        <button
          onClick={handleAdd}
          className="bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 transition-colors"
          aria-label={translations.addIngredientLabel}
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center bg-stone-100 text-stone-700 text-sm font-medium px-3 py-1.5 rounded-full animate-fade-in">
            <span className="capitalize">{ingredient}</span>
            <button
              onClick={() => onRemoveIngredient(index)}
              className="ml-2 text-stone-400 hover:text-red-500 transition-colors"
              aria-label={translations.removeIngredientLabel.replace('{ingredient}', ingredient)}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
