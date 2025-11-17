
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, HardHat, CheckCircle2, Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/app/dashboard/layout";

const wellControlData = {
    "pressure-switch": {
        title: "Pressure Switch",
        troubleshooting: [
            {
                symptom: "Pump won't turn on.",
                solutions: [
                    "No power: Check breaker. Check for 240V at the 'LINE' terminals.",
                    "Low water pressure: The switch won't close if system pressure is below the cut-in pressure.",
                    "Clogged nipple: The tube leading to the switch can get clogged with sediment. Clean it out.",
                    "Bad contacts: Contacts are pitted/burnt and not making a connection. Replace the switch."
                ]
            },
            {
                symptom: "Pump won't turn off.",
                solutions: [
                    "Switch contacts welded shut: The switch has failed and must be replaced.",
                    "Pressure not building: You have a major leak, a bad pump, or a water-logged pressure tank."
                ]
            },
            {
                symptom: "Pump cycles too frequently.",
                solutions: [
                    "Water-logged pressure tank: The tank has lost its air charge. Check and recharge the tank's air pressure (with pump off and water drained).",
                    "Pressure switch differential set too narrow: Adjust the cut-in/cut-out range.",
                    "Leak in plumbing: A running toilet or dripping faucet can cause cycling."
                ]
            }
        ],
        hardwiring: [
            "Connect incoming 240V power from the breaker panel to the two 'LINE' terminals.",
            "Connect the wires going to the pump motor (or control box) to the two 'LOAD' terminals.",
            "Connect all ground wires together and to the green ground screw on the switch.",
            "It does not matter which hot wire goes to which LINE or LOAD terminal, as long as LINE and LOAD are not mixed."
        ]
    },
    "control-box": {
        title: "Control Box (3-Wire Pumps)",
        troubleshooting: [
            {
                symptom: "Pump hums but doesn't start, then trips breaker.",
                solutions: [
                    "Bad start capacitor: This is the most common failure. The capacitor will often look bulged or be leaking oil. Replace with a capacitor of the exact same MFD and voltage rating.",
                    "Bad relay: The relay that engages the start winding is stuck or failed.",
                ]
            },
             {
                symptom: "Pump runs but has low pressure.",
                solutions: [
                    "Bad run capacitor: The motor is running without the phase shift from the run capacitor, causing low efficiency and performance.",
                ]
            }
        ],
        hardwiring: [
            "Follow the wiring diagram inside the control box lid exactly.",
            "Incoming 240V power (L1, L2) connects to the designated terminals.",
            "The three wires going down to the pump motor (typically color-coded Black, Yellow, Red) connect to their corresponding terminals.",
            "The ground wire from the panel connects to the ground wire from the pump.",
        ]
    },
     "jet-pump": {
        title: "Jet Pump (Above Ground)",
        troubleshooting: [
            {
                symptom: "Motor runs, but no water.",
                solutions: [
                    "Lost prime: The pump and suction line must be completely full of water. Re-prime the system.",
                    "Leak in suction line: The pump is sucking air instead of water. Check all fittings on the suction side.",
                    "Foot valve is stuck or clogged: The valve at the bottom of the suction line in the well is not opening.",
                ]
            },
            {
                symptom: "Motor doesn't run.",
                solutions: [
                    "Check power at the pressure switch.",
                    "For 2-wire pumps, the start/run capacitor is inside the motor housing and may have failed.",
                ]
            }
        ],
        hardwiring: [
            "Jet pumps are typically 2-wire pumps (plus ground).",
            "Power comes directly from the 'LOAD' side of the pressure switch.",
            "Connect the two hot wires and the ground according to the motor's terminal diagram.",
            "Many jet pumps have a voltage switch to select between 120V and 240V operation. Ensure it's set correctly to match your supply voltage.",
        ]
    }
}


export default function WellControlsPage() {
    const { subscriptionStatus, handleUpgrade } = useSubscription();

    if (subscriptionStatus !== 'pro') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Card className="max-w-md">
                  <CardHeader>
                      <CardTitle className="flex items-center justify-center gap-2 font-headline text-2xl"><Lock className="text-primary size-8"/> Feature Locked</CardTitle>
                      <CardDescription>
                          The Wellspring Controls guide is a Pro feature. Please upgrade your plan to access this content.
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                      <Button size="lg" onClick={handleUpgrade}>
                          <Crown className="mr-2 h-4 w-4" />
                          Upgrade to Pro
                      </Button>
                      <p className="text-xs text-muted-foreground">Are you a student or educator? Contact us for a discount.</p>
                  </CardContent>
                </Card>
            </div>
        )
    }
    
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Wellspring Controls</h1>
            </div>
            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline"><AlertTriangle className="text-destructive"/>Crucial Safety Warning</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-lg text-muted-foreground">
                           Well pump systems operate on high-voltage (240V) power and can be extremely dangerous. Capacitors in control boxes can hold a lethal charge even when the power is off.
                        </p>
                        <p className="font-semibold">Always turn off the double-pole breaker and verify power is off with a multimeter before beginning any work. If you are not 100% confident, call a professional.</p>
                    </CardContent>
                </Card>

                <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
                    {Object.values(wellControlData).map((component) => (
                        <Card key={component.title}>
                            <CardHeader>
                                <CardTitle className="font-headline">{component.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2"><HardHat />Troubleshooting</h3>
                                    <Accordion type="single" collapsible className="w-full">
                                        {component.troubleshooting.map((ts, index) => (
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
                                 <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle2 className="text-primary"/>Hardwiring</h3>
                                     <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                                        {component.hardwiring.map((step, index) => (
                                            <li key={index}>{step}</li>
                                        ))}
                                     </ul>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </>
    );
}
