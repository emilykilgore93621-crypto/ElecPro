import Image from "next/image";
import Link from "next/link";
import { placeHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const guides = [
    { slug: "outlets", title: "Outlets", imageId: "guide-outlet" },
    { slug: "switches", title: "Switches", imageId: "guide-switch" },
    { slug: "gfci", title: "GFCI", imageId: "guide-gfci" },
    { slug: "weather-tight", title: "Weather-tight", imageId: "guide-weather-tight" },
    { slug: "cameras", title: "Cameras", imageId: "guide-camera" },
    { slug: "stoves", title: "Stoves", imageId: "guide-stove" },
    { slug: "dishwasher", title: "Dishwasher", imageId: "guide-dishwasher" },
    { slug: "garbage-disposal", title: "Garbage Disposal", imageId: "guide-disposal" },
    { slug: "hot-water-heater", title: "Hot Water Heater", imageId: "guide-water-heater" },
]

export default function GuidesPage() {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Installation Guides</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {guides.map((guide) => {
                    const image = placeHolderImages.find(p => p.id === guide.imageId);
                    return (
                        <Link key={guide.slug} href={`/dashboard/guides/${guide.slug}`}>
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
                                    <CardTitle className="font-headline">{guide.title}</CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </>
    );
}
