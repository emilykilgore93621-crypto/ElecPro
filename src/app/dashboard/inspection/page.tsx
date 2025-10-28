
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const inspectionTips = [
    {
        id: "panel-service",
        title: "Panel & Service",
        tips: [
            "Clearances: Ensure 3 feet of clearance in front of the panel.",
            "Labeling: All circuits must be clearly and accurately labeled.",
            "Wiring: No double-tapped breakers unless the breaker is rated for it.",
            "Grounding: Proper grounding and bonding of the service entrance. Per NEC, if a single ground rod has a resistance of 25 ohms or more, a second one is required.",
            "Main Panels > 100A: Often require two ground rods spaced at least 6 feet apart. Always verify with local code amendments.",
        ]
    },
    {
        id: "wiring-methods",
        title: "Wiring Methods",
        tips: [
            "Stapling: Cables secured within 12 inches of boxes and every 4.5 feet.",
            "Protection: Wires protected from physical damage (e.g., nail plates).",
            "Junction Boxes: All splices must be inside an accessible junction box.",
            "Box Fill: No overcrowding of wires in electrical boxes.",
        ]
    },
    {
        id: "outlets-switches",
        title: "Outlets & Switches",
        tips: [
            "GFCI Protection: Required in kitchens, bathrooms, garages, and outdoors.",
            "AFCI Protection: Required in most living areas (bedrooms, living rooms, etc.).",
            "Tamper-Resistant: TR outlets required in all new and renovated homes.",
            "Spacing: Outlets placed every 12 feet of wall space.",
        ]
    },
]

export default function InspectionPage() {
  return (
    <>
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Inspector's Notebook</h1>
        </div>
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle className="font-headline">Common Inspection Checklist</CardTitle>
                <CardDescription>Guidance on what inspectors typically look for to help ensure compliance.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {inspectionTips.map((category) => (
                        <AccordionItem value={category.id} key={category.id}>
                            <AccordionTrigger className="font-headline">{category.title}</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-6 space-y-2">
                                    {category.tips.map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    </>
  );
}
