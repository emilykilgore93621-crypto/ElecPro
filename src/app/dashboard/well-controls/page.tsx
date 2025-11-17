
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, HardHat, CheckCircle2, Lock, Crown, Youtube, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import Link from "next/link";

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
    "contactors": {
        title: "Contactors",
        troubleshooting: [
            {
                symptom: "Pump won't start, contactor doesn't 'click'.",
                solutions: [
                    "No power to the contactor coil. Check the control circuit (float switch, pressure switch, timer).",
                    "Verify the coil voltage (e.g., 24V, 120V, 240V) and ensure the correct voltage is being supplied.",
                    "Bad coil: The contactor's internal coil has failed and the contactor needs to be replaced."
                ]
            },
            {
                symptom: "Contactor 'chatters' or hums loudly.",
                solutions: [
                    "Low voltage to the coil. Check for loose connections in the control circuit.",
                    "Debris is preventing the contactor from closing completely.",
                    "The contactor is failing and should be replaced."
                ]
            }
        ],
        hardwiring: [
            "High-voltage power (e.g., 240V) from the breaker connects to the 'LINE' terminals (L1, L2).",
            "The wires going to the pump motor connect to the 'LOAD' or 'T' terminals (T1, T2).",
            "The low-voltage control circuit (from a float or pressure switch) connects to the two coil terminals.",
            "When the coil is energized by the control circuit, it closes the internal switch, sending power to the pump."
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
    "float-switches": {
        title: "Float Switches",
        troubleshooting: [
            {
                symptom: "Pump doesn't turn on/off at the correct water level.",
                solutions: [
                    "Float is tangled or obstructed and cannot move freely. Ensure clear range of motion.",
                    "Incorrect wiring (Normally Open vs. Normally Closed).",
                    "Internal switch has failed. The float switch needs to be replaced."
                ]
            },
             {
                symptom: "Pump runs continuously.",
                solutions: [
                    "A 'pump down' (Normally Closed) float is stuck in the 'up' position.",
                    "The float switch has failed in a closed state.",
                ]
            }
        ],
        hardwiring: [
            "Normally Open (NO) / 'Pump Up': Closes the circuit when the float rises. Used to fill a tank. The pump turns ON when water is low and OFF when high.",
            "Normally Closed (NC) / 'Pump Down': Opens the circuit when the float rises. Used to empty a sump pit. The pump turns ON when water is high and OFF when low.",
            "Typically wired into the control circuit of a contactor, not usually used to switch the pump's high-voltage power directly.",
            "Can be wired in series with a pressure switch for systems that need both level and pressure control."
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

                <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
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

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline"><ListChecks className="text-primary"/>Pro Tips &amp; Final Checks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">"Buttoning Up" Checklist</h3>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                                <li>**Check Connections:** Give each wire a gentle tug at its terminal to ensure it's secure.</li>
                                <li>**Secure All Covers:** Make sure all junction box, pressure switch, and control box covers are tightly screwed down to keep out moisture, dirt, and critters.</li>
                                <li>**Inspect for Leaks:** After restoring power and pressurizing the system, check all plumbing connections you touched for any drips.</li>
                                <li>**Label Clearly:** If you replaced a component, ensure any new labels are clear and accurate for the next person.</li>
                            </ul>
                        </div>
                         <div>
                            <h3 className="font-semibold mb-2">General Do's and Don'ts</h3>
                             <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                                <li><span className="font-semibold text-primary">DO:</span> Take a 'before' picture of the wiring. It’s the best reference you can have.</li>
                                <li><span className="font-semibold text-destructive">DON'T:</span> Ever trust that a breaker is off. Always verify with a multimeter at the exact point of work.</li>
                                <li><span className="font-semibold text-primary">DO:</span> Match capacitor MFD and voltage ratings exactly. A near match is not good enough.</li>
                                <li><span className="font-semibold text-destructive">DON'T:</span> Forget to discharge a capacitor safely before handling it, even with the power off.</li>
                             </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">When to Call a Professional</h3>
                            <p className="text-sm text-muted-foreground">
                                If you've run through the troubleshooting steps and are still facing issues, or if you feel unsure at any point, it's time to call a professional water technician or "Pump Guy". They have the specialized tools and experience to diagnose complex issues safely. Never risk your safety over a repair.
                            </p>
                        </div>
                         <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><Youtube className="text-red-500"/>Helpful Video Snippets</h3>
                            <div className="flex flex-col space-y-2">
                                <Link href="https://www.youtube.com/results?search_query=how+to+test+well+pressure+switch" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium text-sm">How to Test a Well Pressure Switch</Link>
                                <Link href="https://www.youtube.com/results?search_query=how+to+replace+well+control+box+capacitor" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium text-sm">How to Replace a Well Control Box Capacitor</Link>
                                <Link href="https://www.youtube.com/results?search_query=how+to+check+pressure+tank+air+charge" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium text-sm">How to Check and Recharge a Pressure Tank</Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

    