
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const guideCategories = [
    {
        name: "Fixtures",
        guides: [
            { slug: "cameras", title: "Cameras" },
            { slug: "ceiling-fan", title: "Ceiling Fan" },
            { slug: "lighting-fixtures", title: "Lighting Fixtures" },
            { slug: "outlets", title: "Outlets" },
            { slug: "gfci", title: "GFCI Outlets" },
            { slug: "switches", title: "Switches" },
            { slug: "smart-switch", title: "Smart Switch" },
            { slug: "usb-outlet", title: "USB Outlet" },
        ]
    },
    {
        name: "Appliances",
        guides: [
            { slug: "dishwasher", title: "Dishwasher" },
            { slug: "garbage-disposal", title: "Garbage Disposal" },
            { slug: "hot-water-heater", title: "Hot Water Heater" },
            { slug: "ranges-and-hoods", title: "Ranges and Hoods" },
        ]
    },
    {
        name: "HVAC & Alarms",
        guides: [
            { slug: "cooler-motor", title: "Cooler Motor" },
            { slug: "fire-alarms", title: "Fire Alarms" },
        ]
    },
    {
        name: "Specialty Systems",
        guides: [
            { slug: "rv-wiring", title: "RV / Trailer Wiring" },
            { slug: "well-pump", title: "Water Well Pump" },
        ]
    },
    {
        name: "Service & Distribution",
        guides: [
            { slug: "circuit-breakers", title: "Circuit Breaker Safety" },
            { slug: "generator-transfer-switch", title: "Generator Transfer Switch" },
            { slug: "weather-tight", title: "Weather-tight Outlets" },
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
                                return (
                                    <Link key={guide.slug} href={`/dashboard/guides/${guide.slug}`}>
                                        <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
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
