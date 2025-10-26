
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { placeHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

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
                            <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                                {image && (
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        width={600}
                                        height={400}
                                        data-ai-hint={image.imageHint}
                                        className="aspect-video w-full object-cover"
                                    />
                                )}
                                <CardHeader className="flex-1">
                                    <CardTitle className="font-headline text-lg">{topic.title}</CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </>
    );
}
