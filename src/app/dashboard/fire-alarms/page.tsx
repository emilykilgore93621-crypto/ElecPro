
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { AlertTriangle, HardHat, CheckCircle2, Home } from "lucide-react";
import Link from "next/link";

const fireAlarmData = {
    "smoke-alarms": {
        title: "Smoke Alarms",
        types: [
            {
                name: "Ionization Alarms",
                description: "More responsive to flaming fires. Best for areas near kitchens or where fast, open-flame fires could start.",
            },
            {
                name: "Photoelectric Alarms",
                description: "More responsive to smoldering fires (e.g., from a lit cigarette on furniture). Better at avoiding false alarms from cooking.",
            },
            {
                name: "Dual-Sensor Alarms",
                description: "Combines both ionization and photoelectric sensors into a single unit for the best of both worlds. Recommended by the NFPA.",
            }
        ],
        placement: [
            "Install inside each bedroom, outside each sleeping area, and on every level of the home.",
            "On ceilings, install at least 4 inches away from any wall.",
            "On walls, install between 4 and 12 inches from the ceiling.",
            "Avoid installing near kitchens, bathrooms, or heating appliances to reduce false alarms.",
        ]
    },
    "co-alarms": {
        title: "Carbon Monoxide (CO) Alarms",
        placement: [
            "Install on every level of the home and outside each sleeping area.",
            "CO is roughly the same density as air, so alarms can be placed at any height, but follow manufacturer instructions.",
            "Do not install in garages, kitchens, or furnace rooms where CO is sometimes present.",
            "Keep alarms at least 15 feet away from fuel-burning appliances."
        ],
         troubleshooting: [
            {
                symptom: "Alarm chirps every 30-60 seconds.",
                solutions: [
                    "Low battery: This is the most common cause. Replace the battery immediately.",
                    "End of life: Most alarms have a lifespan of 7-10 years. The chirping may signal it's time for a replacement.",
                ]
            },
            {
                symptom: "False alarms (full alarm, not chirping).",
                solutions: [
                    "Alarm is too close to a fuel-burning appliance or source of humidity/steam.",
                    "Contaminants like dust or insects inside the alarm. Clean with a vacuum hose.",
                ]
            }
        ],
    },
     "hardwiring": {
        title: "Hardwiring & Interconnection",
        description: "Hardwired alarms are connected to your home's 120V power and have a battery backup. Modern codes require them to be interconnected, meaning if one alarm sounds, they all sound.",
        wiring: [
            "Turn off power at the circuit breaker. This should be a dedicated circuit if possible, but is often shared with lighting.",
            "Most alarms use a 3-wire pigtail: Black (Hot), White (Neutral), and Red/Orange (Interconnect).",
            "Connect the corresponding wires: Black to Black, White to White, and the interconnect traveler wire (usually Red) to the Red/Orange wire on the pigtail.",
            "If it's the last alarm in a run, cap the outgoing interconnect wire.",
            "Mount the base to the ceiling box, plug in the pigtail, and attach the alarm.",
            "Restore power and test the system by pressing and holding the 'Test' button on one alarm. All connected alarms should sound."
        ]
    }
}


export default function FireAlarmsPage() {
    const fireAlarmImage = placeHolderImages.find(p => p.id === 'guide-fire-alarm');
    
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Fire Alarms & Safety Systems</h1>
            </div>
            <div className="space-y-6">
                <Card className="overflow-hidden">
                    {fireAlarmImage && (
                        <Image
                            src={fireAlarmImage.imageUrl}
                            alt={fireAlarmImage.description}
                            width={1200}
                            height={400}
                            data-ai-hint={fireAlarmImage.imageHint}
                            className="w-full object-cover aspect-[3/1]"
                        />
                    )}
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline"><AlertTriangle className="text-destructive"/>Life Safety Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-lg text-muted-foreground">
                           Properly installed and maintained smoke and CO alarms are essential for life safety. This guide provides general information, but you must always follow manufacturer instructions and local building codes.
                        </p>
                        <p className="font-semibold">Consult the <Link href="https://www.nfpa.org/nec" target="_blank" rel="noopener noreferrer" className="text-primary underline">National Fire Protection Association (NFPA)</Link> for the most current codes and standards.</p>
                    </CardContent>
                </Card>

                <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">{fireAlarmData["smoke-alarms"].title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><HardHat />Types of Smoke Alarms</h3>
                                <Accordion type="single" collapsible className="w-full">
                                    {fireAlarmData["smoke-alarms"].types.map((type, index) => (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            <AccordionTrigger>{type.name}</AccordionTrigger>
                                            <AccordionContent>
                                                {type.description}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><Home />Placement Rules (NFPA 72)</h3>
                                 <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                                    {fireAlarmData["smoke-alarms"].placement.map((step, index) => (
                                        <li key={index}>{step}</li>
                                    ))}
                                 </ul>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">{fireAlarmData["co-alarms"].title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><Home />Placement Rules</h3>
                                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                                    {fireAlarmData["co-alarms"].placement.map((step, index) => (
                                        <li key={index}>{step}</li>
                                    ))}
                                 </ul>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><HardHat />Troubleshooting</h3>
                                <Accordion type="single" collapsible className="w-full">
                                    {fireAlarmData["co-alarms"].troubleshooting.map((ts, index) => (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            <AccordionTrigger>{ts.symptom}</AccordionTrigger>
                                            <AccordionContent>
                                                <ul className="list-disc pl-5 space-y-2">
                                                    {ts.solutions.map((sol, i) => <li key={i}>{sol}</li>)}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">{fireAlarmData.hardwiring.title}</CardTitle>
                        <CardDescription>{fireAlarmData.hardwiring.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle2 className="text-primary"/>Wiring Steps</h3>
                             <ul className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                                {fireAlarmData.hardwiring.wiring.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                             </ul>
                        </div>
                    </CardContent>
                 </Card>

            </div>
        </>
    );
}
