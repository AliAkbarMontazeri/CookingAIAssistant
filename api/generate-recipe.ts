
import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';
import type { Language } from "../translations";

// This is the Vercel serverless function handler
export async function POST(request: Request) {
  const { ingredients, language } = await request.json();

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return new Response(JSON.stringify({ error: 'Ingredients are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const model = 'gemini-2.5-flash';

    const recipeSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'The exact title of the recipe from the source.' },
            description: { type: Type.STRING, description: 'A short, enticing description of the dish, based on the source.' },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of ingredients with quantities, as listed in the source recipe.' },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Step-by-step instructions for preparing the dish, based on the source recipe.' },
            prepTime: { type: Type.STRING, description: 'Estimated preparation time, e.g., "15 minutes".' },
            cookTime: { type: Type.STRING, description: 'Estimated cooking time, e.g., "30 minutes".' },
            servings: { type: Type.STRING, description: 'The number of servings the recipe makes, e.g., "4 servings".' },
            tip: { type: Type.STRING, description: 'An optional helpful tip or variation, if mentioned in the source.' },
            sourceUrls: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'An array containing at least one direct URL to the real, online recipe this data was extracted from. This is mandatory.' },
            error: { type: Type.STRING, description: 'If no real, verifiable online recipe can be found, provide a reason here, like "NO_RECIPE_FOUND". Otherwise, this must be null.' },
        },
        required: ['title', 'description', 'ingredients', 'instructions', 'prepTime', 'cookTime', 'servings', 'sourceUrls'],
    };

    const languageMap = { en: 'English', id: 'Indonesian' };
    const prompt = `
    **ROLE:** You are an expert recipe finder. Your ONLY task is to find a single, real, popular, and highly-rated recipe online that can be made with the user's ingredients.
    **CORE TASK:**
    1.  Analyze the user's ingredients: ${ingredients.join(', ')}.
    2.  Search online for a real, existing recipe that uses the main ingredients from this list.
    3.  If you find a valid recipe, extract its details and populate the JSON object according to the schema.
    4.  You MUST include at least one direct, working URL to the source recipe in the 'sourceUrls' field. This is not optional.
    5.  If you CANNOT find a real, verifiable online recipe for the core ingredients, you MUST set the 'error' field in the JSON response to "NO_RECIPE_FOUND" and nothing else.
    **STRICT RULES (NON-NEGOTIABLE):**
    -   **DO NOT INVENT A RECIPE.** You are forbidden from creating, combining, or hallucinating a recipe. Your entire output must be based on a single, existing online source.
    -   **DO NOT USE PLACEHOLDER URLS.** The URL must be a real link to a recipe website.
    -   If a user-provided ingredient is strange or doesn't fit with the others (e.g., 'chicken, tomatoes, chocolate'), ignore the strange ingredient and find a recipe for the ingredients that do make sense together.
    -   Assume basic pantry staples like salt, pepper, oil, and water are available.
    -   The entire response, including all text fields, must be in ${languageMap[language as Language]}.
    Provide your response as a single JSON object that conforms to the provided schema.`;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: recipeSchema,
        }
    });
    
    const text = response.text;
    const recipeData = JSON.parse(text);

    return new Response(JSON.stringify(recipeData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate recipe from the API.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
