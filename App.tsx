import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { IngredientInput } from './components/IngredientInput';
import { RecipeCard } from './components/RecipeCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';
import { generateRecipe } from './services/geminiService';
import type { Recipe } from './types';
import { ChefHatIcon } from './components/icons/ChefHatIcon';
import { translations, Language } from './translations';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>(['flour', 'sugar', 'eggs']);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  const t = translations[language];

  const handleAddIngredient = (ingredient: string) => {
    if (ingredient && !ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const handleGenerateRecipe = useCallback(async () => {
    if (ingredients.length === 0) {
      setError(t.errorIngredients);
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const generatedRecipe = await generateRecipe(ingredients, language);
      setRecipe(generatedRecipe);
    } catch (err) {
      console.error(err);
       if (err instanceof Error && err.message === 'NO_RECIPE_FOUND') {
        setError(t.errorNoRecipeFound);
      } else {
        setError(t.errorApi);
      }
    } finally {
      setIsLoading(false);
    }
  }, [ingredients, language, t]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        language={language}
        setLanguage={setLanguage}
        translations={t}
      />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-300">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-700 mb-2">{t.pantryTitle}</h2>
          <p className="text-stone-500 mb-6">{t.pantryDescription}</p>

          <IngredientInput
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            translations={t}
          />

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleGenerateRecipe}
              disabled={isLoading || ingredients.length === 0}
              className="flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-emerald-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {isLoading ? t.generatingButton : t.generateButton}
              {!isLoading && <ChefHatIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="w-full max-w-3xl mt-8">
          {isLoading && <LoadingSpinner translations={t} />}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">{error}</div>}
          {recipe && (
             <div className="animate-fade-in">
                <RecipeCard recipe={recipe} translations={t} />
             </div>
          )}
          {!isLoading && !recipe && !error && (
              <div className="text-center text-stone-500 mt-12 p-8 bg-white/50 rounded-2xl">
                  <ChefHatIcon className="w-16 h-16 mx-auto mb-4 text-stone-400" />
                  <p className="text-lg">{t.recipeAwaits}</p>
              </div>
          )}
        </div>
      </main>
      <Footer translations={t} />
    </div>
  );
};

export default App;
