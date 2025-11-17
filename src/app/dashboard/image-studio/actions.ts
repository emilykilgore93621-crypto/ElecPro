
'use server';

import { generateImage } from '@/ai/flows/generate-image-flow';

export type ImageGenerationState = {
  dataUri: string | null;
  error: string | null;
};

export async function imageGenerationAction(prevState: ImageGenerationState, formData: FormData) {
  const prompt = formData.get('prompt') as string;
  if (!prompt || prompt.trim().length < 5) {
    return { dataUri: null, error: 'Please enter a more descriptive prompt (at least 5 characters).' };
  }
  try {
    const result = await generateImage(prompt);
    return { dataUri: result.dataUri, error: null };
  } catch (e: any) {
    console.error(e);
    return { dataUri: null, error: e.message || 'An error occurred during image generation.' };
  }
}
