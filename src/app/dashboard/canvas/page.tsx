import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, Share2, PenSquare } from "lucide-react";

export default function CanvasPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Interactive Canvas</h1>
        <div className="flex gap-2">
            <Button variant="outline" disabled>
                <Save className="mr-2 h-4 w-4"/>
                Save
            </Button>
            <Button disabled>
                <Share2 className="mr-2 h-4 w-4" />
                Export & Share
            </Button>
        </div>
      </div>
      <Card className="flex-1">
        <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="p-4 bg-muted rounded-full mb-4">
              <PenSquare className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold font-headline mb-2">Wiring Canvas Coming Soon</h2>
            <p className="text-muted-foreground max-w-md">
                We're building an interactive canvas for you to design, simulate, and share your wiring diagrams. Stay tuned!
            </p>
        </CardContent>
      </Card>
    </>
  );
}
