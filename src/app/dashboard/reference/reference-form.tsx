"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const initialState: { guidelines: string; error: string | null } = {
  guidelines: '',
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
         <Sparkles className="mr-2 h-4 w-4" />
          Get Guidelines
        </>
      )}
    </Button>
  );
}

export function ReferenceForm({
  getGuidelines,
}: {
  getGuidelines: (
    state: typeof initialState,
    data: FormData
  ) => Promise<typeof initialState>;
}) {
  const [state, formAction] = useFormState(getGuidelines, initialState);

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <Textarea
          name="prompt"
          placeholder="e.g., I'm installing a 240V, 50A circuit for an EV charger in a garage. The wire run is 60 feet from the panel."
          className="min-h-[120px]"
          required
        />
        <SubmitButton />
      </form>

      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.guidelines && (
        <Card className="bg-muted/50">
            <CardContent className="p-6">
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap font-code">
                    {state.guidelines}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
