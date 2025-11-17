
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';

const initialState: { dataUri: string | null; error: string | null } = {
  dataUri: null,
  error: null,
};

// Define the server action
async function imageGenerationAction(prevState: typeof initialState, formData: FormData) {
  'use server';
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

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Image...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Image
        </>
      )}
    </Button>
  );
}

export default function ImageStudioPage() {
  const [state, formAction] = useActionState(imageGenerationAction, initialState);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">AI Vision</h1>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Camera />
              AI Image Generator
            </CardTitle>
            <CardDescription>
              Describe the image you want to create. The AI will generate a new, unique image based on your prompt. You can then copy the resulting data URI and provide it to replace placeholders in the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <Input
                name="prompt"
                placeholder="e.g., 'A close-up of a modern GFCI outlet on a marble backsplash'"
                className="text-base"
                required
              />
              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        {state.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Generation Failed</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {state.dataUri && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Generated Image</CardTitle>
                 <CardDescription>
                    Right-click to save the image, or copy the data URI below to use it in the app.
                 </CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src={state.dataUri}
                  alt="AI-generated image"
                  width={1024}
                  height={1024}
                  className="rounded-lg border object-contain w-full"
                />
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Image Data URI</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-2 border bg-muted rounded-md text-xs break-all font-code">
                        {state.dataUri}
                    </div>
                </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
