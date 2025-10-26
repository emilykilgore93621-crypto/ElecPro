
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeHolderImages } from "@/lib/placeholder-images";
import { CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import Image from "next/image";
import { guideData } from "./guide-data";

export default function GuideDetailPage({ params }: { params: { slug: string } }) {
    const guide = guideData[params.slug];
    const title = guide?.title ?? params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const imageId = `guide-${params.slug}`;
    const image = placeHolderImages.find(p => p.id === imageId);

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">{title} Installation</h1>
            </div>
            <div className="space-y-6">
                <Card className="overflow-hidden">
                    {image && (
                        <Image
                            src={image.imageUrl}
                            alt={image.description}
                            width={1200}
                            height={400}
                            data-ai-hint={image.imageHint}
                            className="w-full object-cover aspect-[3/1]"
                        />
                    )}
                </Card>

                {guide ? (
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-headline">Installation Steps</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                   <ol className="list-decimal list-inside space-y-3">
                                       {guide.steps.map((step, index) => <li key={index}>{step}</li>)}
                                   </ol>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 font-headline"><AlertTriangle className="text-destructive"/>Safety First</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                   <p className="text-muted-foreground">
                                       {guide.safetyNotes ? guide.safetyNotes : "Always turn off power at the breaker before beginning work. Verify the power is off with a voltage tester. Consult a professional if you are unsure about any step."}
                                   </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-headline">Required Materials</CardTitle>
                                </CardHeader>
                                <CardContent>
                                     <ul className="space-y-2 text-muted-foreground">
                                        {guide.materials.map((material, index) => (
                                            <li key={index} className="flex items-center gap-2"><CheckCircle2 className="text-primary size-4" /> {material}</li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 font-headline"><Lightbulb className="text-accent"/>Pro Tips</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-muted-foreground list-disc list-inside">
                                        {guide.proTips ? guide.proTips.map((tip, index) => (
                                            <li key={index}>{tip}</li>
                                        )) : (
                                            <li>Tips from expert electricians will be available here.</li>
                                        )}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                     <Card>
                        <CardHeader>
                            <CardTitle>Content Coming Soon</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Detailed instructions for this guide are being prepared and will be available shortly.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
