'use server';

/**
 * @fileOverview Summarizes NFPA articles to provide key points.
 *
 * - summarizeNfpaArticle - A function that summarizes the NFPA article.
 * - SummarizeNfpaArticleInput - The input type for the summarizeNfpaArticle function.
 * - SummarizeNfpaArticleOutput - The return type for the summarizeNfpaArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNfpaArticleInputSchema = z.object({
  articleText: z
    .string()
    .describe('The NFPA article text to be summarized.'),
});
export type SummarizeNfpaArticleInput = z.infer<typeof SummarizeNfpaArticleInputSchema>;

const SummarizeNfpaArticleOutputSchema = z.object({
  summary: z
    .string()
    .describe('A summary of the key points in the NFPA article.'),
});
export type SummarizeNfpaArticleOutput = z.infer<typeof SummarizeNfpaArticleOutputSchema>;

export async function summarizeNfpaArticle(
  input: SummarizeNfpaArticleInput
): Promise<SummarizeNfpaArticleOutput> {
  return summarizeNfpaArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNfpaArticlePrompt',
  input: {schema: SummarizeNfpaArticleInputSchema},
  output: {schema: SummarizeNfpaArticleOutputSchema},
  prompt: `Summarize the following NFPA article, extracting the key points:

  Article Text:
  {{articleText}}`,
});

const summarizeNfpaArticleFlow = ai.defineFlow(
  {
    name: 'summarizeNfpaArticleFlow',
    inputSchema: SummarizeNfpaArticleInputSchema,
    outputSchema: SummarizeNfpaArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
