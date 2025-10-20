
import type { Recipe } from '../types';
import type { Language } from "../translations";

export const generateRecipe = async (ingredients: string[], language: Language): Promise<Recipe> => {
    try {
        const response = await fetch('/api/generate-recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredients, language }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API request failed');
        }

        const recipeData = await response.json();

        if (recipeData.error === 'NO_RECIPE_FOUND') {
            throw new Error('NO_RECIPE_FOUND');
        }

        if (!recipeData.title || !recipeData.ingredients || recipeData.ingredients.length === 0 || !recipeData.sourceUrls || recipeData.sourceUrls.length === 0) {
            throw new Error('Invalid recipe format received from API.');
        }

        return recipeData as Recipe;

    } catch (e) {
        console.error("Error generating recipe:", e);
        if (e instanceof Error) {
           throw e;
        }
        throw new Error('An unknown error occurred.');
    }
};
