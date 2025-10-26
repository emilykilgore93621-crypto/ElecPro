'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing NEC (National Electrical Code) guidelines based on a user's electrical installation scenario.
 *
 * - necQuickGuide - A function that takes a user prompt and returns relevant NEC guidelines.
 * - NecQuickGuideInput - The input type for the necQuickGuide function.
 * - NecQuickGuideOutput - The return type for the necQuickGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NecQuickGuideInputSchema = z.string().describe('A description of an electrical installation scenario.');
export type NecQuickGuideInput = z.infer<typeof NecQuickGuideInputSchema>;

const NecQuickGuideOutputSchema = z.object({
  guidelines: z.string().describe('A summary of relevant NEC guidelines and best practices for the given scenario.'),
});
export type NecQuickGuideOutput = z.infer<typeof NecQuickGuideOutputSchema>;

export async function necQuickGuide(input: NecQuickGuideInput): Promise<NecQuickGuideOutput> {
  return necQuickGuideFlow(input);
}

const necQuickGuidePrompt = ai.definePrompt({
  name: 'necQuickGuidePrompt',
  input: {schema: NecQuickGuideInputSchema},
  output: {schema: NecQuickGuideOutputSchema},
  prompt: `You are an expert electrician with deep knowledge of the NEC (National Electrical Code).

  A user will provide a description of an electrical installation scenario.  Your task is to provide a summary of the relevant NEC guidelines and best practices to ensure code compliance.

  Scenario: {{{$input}}}`, // referencing the input string directly
});

const necQuickGuideFlow = ai.defineFlow(
  {
    name: 'necQuickGuideFlow',
    inputSchema: NecQuickGuideInputSchema,
    outputSchema: NecQuickGuideOutputSchema,
  },
  async input => {
    const {output} = await necQuickGuidePrompt(input);
    return output!;
  }
);
