
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
    };

    const languageMap = { en: 'English', id: 'Indonesian' };
    // FIX: Refactor to use systemInstruction for better prompt structure and clarity.
    const systemInstruction = `You are an expert recipe finder. Your ONLY task is to find a single, real, popular, and highly-rated recipe online based on a list of ingredients.

**Rules:**
- You MUST find a real, existing recipe from a reputable online source.
- You MUST NOT invent, create, or hallucinate a recipe. Your entire output must be based on a single, existing online source.
- You MUST provide at least one direct, working URL to the source recipe in the 'sourceUrls' field. Do not use placeholder URLs.
- If you cannot find a real, verifiable online recipe for the core ingredients, you MUST set the 'error' field in the JSON response to "NO_RECIPE_FOUND". In this case, other fields should be null or empty arrays.
- Ignore any strange ingredients that don't fit with the others (e.g., 'chicken, tomatoes, chocolate') and find a recipe for the ingredients that do make sense together.
- Assume basic pantry staples like salt, pepper, oil, and water are available to the user.
- The entire response, including all text fields, must be in ${languageMap[language as Language]}.
- Your entire response must be a single JSON object that conforms to the provided schema.`;
    
    const prompt = `Find a recipe using these ingredients: ${ingredients.join(', ')}.`;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            systemInstruction,
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
