
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { placeHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const guides = [
    { slug: "cameras", title: "Cameras", imageId: "guide-camera" },
    { slug: "ceiling-fan", title: "Ceiling Fan", imageId: "guide-ceiling-fan" },
    { slug: "circuit-breakers", title: "Circuit Breaker Safety", imageId: "safety-breakers" },
    { slug: "cooler-motor", title: "Cooler Motor", imageId: "guide-cooler-motor" },
    { slug: "dishwasher", title: "Dishwasher", imageId: "guide-dishwasher" },
    { slug: "fire-alarms", title: "Fire Alarms", imageId: "guide-fire-alarm" },
    { slug: "garbage-disposal", title: "Garbage Disposal", imageId: "guide-garbage-disposal" },
    { slug: "gfci", title: "GFCI", imageId: "guide-gfci" },
    { slug: "hot-water-heater", title: "Hot Water Heater", imageId: "guide-hot-water-heater" },
    { slug: "outlets", title: "Outlets", imageId: "guide-outlet-wiring" },
    { slug: "power-tools", title: "Power Tool Handling", imageId: "safety-tools" },
    { slug: "ppe", title: "Personal Protective Equipment", imageId: "safety-ppe" },
    { slug: "ranges-and-hoods", title: "Ranges and Hoods", imageId: "guide-ranges-and-hoods" },
    { slug: "rv-wiring", title: "RV / Trailer Wiring", imageId: "guide-rv-wiring" },
    { slug: "safe-wiring", title: "Safe Wiring Practices", imageId: "safety-wiring" },
    { slug: "smart-switch", title: "Smart Switch", imageId: "guide-smart-switch" },
    { slug: "switches", title: "Switches", imageId: "guide-switch" },
    { slug: "usb-outlet", title: "USB Outlet", imageId: "guide-usb-outlet" },
    { slug: "weather-tight", title: "Weather-tight", imageId: "guide-weather-tight" },
    { slug: "well-pump", title: "Water Well Pump", imageId: "guide-well-pump" },
].sort((a, b) => a.title.localeCompare(b.title));

export default function GuidesPage() {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Installation & Safety Guides</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {guides.map((guide) => {
                    const image = placeHolderImages.find(p => p.id === guide.imageId);
                    return (
                        <Link key={guide.slug} href={`/dashboard/guides/${guide.slug}`}>
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
                                    <CardTitle className="font-headline text-lg">{guide.title}</CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </>
    );
}
