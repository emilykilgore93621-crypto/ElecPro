import Image from "next/image";
import Link from "next/link";
import { placeHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const safetyTopics = [
    { slug: "circuit-breakers", title: "Circuit Breaker Safety", imageId: "safety-breakers" },
    { slug: "safe-wiring", title: "Safe Wiring Practices", imageId: "safety-wiring" },
    { slug: "power-tools", title: "Power Tool Handling", imageId: "safety-tools" },
    { slug: "ppe", title: "Personal Protective Equipment", imageId: "safety-ppe" },
]

export default function SafetyPage() {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Safety Overview</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {safetyTopics.map((topic) => {
                    const image = placeHolderImages.find(p => p.id === topic.imageId);
                    return (
                        <Link key={topic.slug} href={`/dashboard/guides/${topic.slug}`}>
                            <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 h-full">
                                {image && (
                                    <div className="aspect-video relative">
                                        <Image
                                            src={image.imageUrl}
                                            alt={image.description}
                                            fill
                                            className="object-cover"
                                            data-ai-hint={image.imageHint}
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="font-headline">{topic.title}</CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </>
    );
}
