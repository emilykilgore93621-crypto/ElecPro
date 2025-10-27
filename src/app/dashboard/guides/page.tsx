
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { placeHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const guideCategories = [
    {
        name: "Fixtures",
        guides: [
            { slug: "cameras", title: "Cameras", imageId: "guide-camera" },
            { slug: "ceiling-fan", title: "Ceiling Fan", imageId: "guide-ceiling-fan" },
            { slug: "lighting-fixtures", title: "Lighting Fixtures", imageId: "guide-lighting" },
            { slug: "outlets", title: "Outlets", imageId: "guide-outlet-wiring" },
            { slug: "gfci", title: "GFCI Outlets", imageId: "guide-gfci" },
            { slug: "switches", title: "Switches", imageId: "guide-switch" },
            { slug: "smart-switch", title: "Smart Switch", imageId: "guide-smart-switch" },
            { slug: "usb-outlet", title: "USB Outlet", imageId: "guide-usb-outlet" },
        ]
    },
    {
        name: "Appliances",
        guides: [
            { slug: "dishwasher", title: "Dishwasher", imageId: "guide-dishwasher" },
            { slug: "garbage-disposal", title: "Garbage Disposal", imageId: "guide-garbage-disposal" },
            { slug: "hot-water-heater", title: "Hot Water Heater", imageId: "guide-hot-water-heater" },
            { slug: "ranges-and-hoods", title: "Ranges and Hoods", imageId: "guide-ranges-and-hoods" },
        ]
    },
    {
        name: "HVAC & Alarms",
        guides: [
            { slug: "cooler-motor", title: "Cooler Motor", imageId: "guide-cooler-motor" },
            { slug: "fire-alarms", title: "Fire Alarms", imageId: "guide-fire-alarm" },
        ]
    },
    {
        name: "Specialty Systems",
        guides: [
            { slug: "rv-wiring", title: "RV / Trailer Wiring", imageId: "guide-rv-wiring" },
            { slug: "well-pump", title: "Water Well Pump", imageId: "guide-well-pump" },
        ]
    },
    {
        name: "Service & Distribution",
        guides: [
            { slug: "circuit-breakers", title: "Circuit Breaker Safety", imageId: "safety-breakers" },
            { slug: "generator-transfer-switch", title: "Generator Transfer Switch", imageId: "guide-transfer-switch" },
            { slug: "weather-tight", title: "Weather-tight Outlets", imageId: "guide-weather-tight" },
        ]
    },
];

export default function GuidesPage() {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Installation & Safety Guides</h1>
            </div>
            <div className="space-y-8">
                {guideCategories.map((category) => (
                    <div key={category.name}>
                        <h2 className="text-2xl font-headline mb-4">{category.name}</h2>
                        <Separator className="mb-6" />
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {category.guides.sort((a,b) => a.title.localeCompare(b.title)).map((guide) => {
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
                    </div>
                ))}
            </div>
        </>
    );
}
