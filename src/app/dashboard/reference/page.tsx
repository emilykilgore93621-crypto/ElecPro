
import { necQuickGuide } from '@/ai/flows/nec-quick-guide';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReferenceForm } from './reference-form';
import Link from 'next/link';

export default function ReferencePage() {
  async function getGuidelines(
    prevState: { guidelines: string; error: string | null },
    formData: FormData
  ) {
    'use server';
    const prompt = formData.get('prompt') as string;
    if (!prompt || prompt.trim().length < 10) {
      return { guidelines: '', error: 'Please enter a scenario with at least 10 characters.' };
    }
    try {
      const result = await necQuickGuide(prompt);
      return { guidelines: result.guidelines, error: null };
    } catch (e) {
      console.error(e);
      return { guidelines: '', error: 'An error occurred while fetching guidelines. Please try again.' };
    }
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Code &amp; Conduit</h1>
      </div>
      <div className="space-y-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-headline">NEC Quick Guide (AI-Powered)</CardTitle>
                <CardDescription>
                  Describe your electrical installation scenario below. Our AI assistant will provide a summary of relevant NEC guidelines and best practices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReferenceForm getGuidelines={getGuidelines} />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">External Resources</CardTitle>
                <CardDescription>Quick links to official documentation.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                  <Link href="https://www.nfpa.org/nec" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">NEC (NFPA 70)</Link>
                  <Link href="https://www.pge.com/en/search-results.html?fulltext=RWxlY3RyaWNhbCBpbnNwZWN0aW9uIHJlc2lkZW50aWFs" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">PGE Green Book</Link>
                  <Link href="https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">NFPA Codes & Standards</Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
