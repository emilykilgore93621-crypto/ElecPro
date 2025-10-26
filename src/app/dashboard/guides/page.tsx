import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

const guides = [
    { slug: "outlets", title: "Outlets" },
    { slug: "switches", title: "Switches" },
    { slug: "gfci", title: "GFCI" },
    { slug: "usb-outlet", title: "USB Outlet" },
    { slug: "smart-switch", title: "Smart Switch" },
    { slug: "ceiling-fan", title: "Ceiling Fan" },
    { slug: "weather-tight", title: "Weather-tight" },
    { slug: "cameras", title: "Cameras" },
    { slug: "stoves", title: "Stoves" },
    { slug: "dishwasher", title: "Dishwasher" },
    { slug: "garbage-disposal", title: "Garbage Disposal" },
    { slug: "hot-water-heater", title: "Hot Water Heater" },
]

export default function GuidesPage() {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Installation Guides</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {guides.map((guide) => {
                    return (
                        <Link key={guide.slug} href={`/dashboard/guides/${guide.slug}`}>
                            <Card className="flex flex-col justify-center items-center text-center p-6 transition-all hover:shadow-lg hover:-translate-y-1 h-full">
                                <Wrench className="h-12 w-12 mb-4 text-primary" />
                                <CardHeader>
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
