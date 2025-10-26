
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeHolderImages } from "@/lib/placeholder-images";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function GuideDetailPage({ params }: { params: { slug: string } }) {
    const title = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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

                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Installation Steps</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <p className="text-muted-foreground">Detailed step-by-step instructions for installing a {title} will be available here soon.</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Safety First</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <p className="text-muted-foreground">Always turn off power at the breaker before beginning work. Consult a professional if you are unsure about any step.</p>
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
                                    <li className="flex items-center gap-2"><CheckCircle2 className="text-primary size-4" /> Material list coming soon...</li>
                                </ul>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Pro Tips</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Tips from expert electricians will be available here.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
