import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({projectId: 'gen-lang-client-0861813756'})],
  model: 'googleai/gemini-2.5-flash',
});
