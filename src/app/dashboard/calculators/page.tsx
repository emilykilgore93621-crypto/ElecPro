
"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Lightbulb, AlertCircle, CheckCircle, Scale, Sigma, Zap, Box } from "lucide-react";

const standardBoxSizes: { [key: string]: { volume: number, type: string } } = {
    "12.5": { volume: 12.5, type: "Single-gang handy box (4 x 2 1/8 x 1 7/8)" },
    "14": { volume: 14, type: "Single-gang switch box (3 x 2 x 2 1/2)" },
    "18": { volume: 18, type: "Single-gang switch box (3 x 2 x 3 1/2)" },
    "21": { volume: 21, type: "4-inch square box (4 x 4 x 1 1/2)" },
    "25.5": { volume: 25.5, type: "Double-gang masonry box (3 3/4 x 3 3/4 x 2 1/2)" },
    "30.3": { volume: 30.3, type: "4-inch square box (4 x 4 x 2 1/8)" },
    "42": { volume: 42, type: "4-11/16 inch square box (4 11/16 x 4 11/16 x 2 1/8)" },
};

export default function CalculatorsPage() {
    const [ohmsResult, setOhmsResult] = useState<{ v?: number, i?: number, r?: number, p?: number, error?: string } | null>(null);
    const [wireSizeResult, setWireSizeResult] = useState<{ awg?: string, voltageDrop?: number, necArticle?: string, error?: string } | null>(null);
    const [boxFillResult, setBoxFillResult] = useState<{ totalVolume?: number, necArticle?: string, recommendedBox?: { volume: number, type: string }, error?: string } | null>(null);

    const handleOhmsLawCalculate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const voltage = parseFloat(formData.get('voltage') as string);
        const current = parseFloat(formData.get('current') as string);
        const resistance = parseFloat(formData.get('resistance') as string);
        const power = parseFloat(formData.get('power') as string);

        let v = voltage, i = current, r = resistance, p = power;

        const inputs = [v, i, r, p].filter(val => !isNaN(val)).length;

        if (inputs < 2) {
            setOhmsResult({ error: "Please provide at least two values." });
            return;
        }

        if (!isNaN(v) && !isNaN(i)) { r = v / i; p = v * i; }
        else if (!isNaN(v) && !isNaN(r)) { i = v / r; p = v * i; }
        else if (!isNaN(v) && !isNaN(p)) { i = p / v; r = v / i; }
        else if (!isNaN(i) && !isNaN(r)) { v = i * r; p = v * i; }
        else if (!isNaN(i) && !isNaN(p)) { v = p / i; r = v / i; }
        else if (!isNaN(r) && !isNaN(p)) { v = Math.sqrt(p * r); i = p / v; }
        else {
             setOhmsResult({ error: "Cannot calculate with the provided values." });
             return;
        }
        
        setOhmsResult({ v: Number(v.toFixed(2)), i: Number(i.toFixed(2)), r: Number(r.toFixed(2)), p: Number(p.toFixed(2)) });
    };

    const handleWireSizingCalculate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const voltage = parseFloat(formData.get('voltage-ws') as string);
        const current = parseFloat(formData.get('current-ws') as string);
        const distance = parseFloat(formData.get('distance-ws') as string);
        const material = formData.get('material-ws') as string;
        
        if(isNaN(voltage) || isNaN(current) || isNaN(distance) || !material) {
            setWireSizeResult({ error: "Please fill out all fields." });
            return;
        }
        
        const K = material === 'copper' ? 12.9 : 21.2; // Resistivity
        const maxVoltageDrop = voltage * 0.03;

        // NEC 310.16 Ampacity & AWG Circular Mils for 75°C
        const awgData = [
            { awg: "14", ampacity: 15, cm: 4110 }, { awg: "12", ampacity: 20, cm: 6530 },
            { awg: "10", ampacity: 30, cm: 10380 }, { awg: "8", ampacity: 50, cm: 16510 },
            { awg: "6", ampacity: 65, cm: 26240 }, { awg: "4", ampacity: 85, cm: 41740 },
            { awg: "2", ampacity: 115, cm: 66360 }, { awg: "1/0", ampacity: 150, cm: 105600 },
        ];

        let suitableWireForAmpacity = awgData.find(w => w.ampacity >= current);
        if (!suitableWireForAmpacity) {
            setWireSizeResult({ error: "Current is too high for standard residential wiring." });
            return;
        }

        let finalAWG = suitableWireForAmpacity;
        let voltageDrop = (2 * K * current * distance) / finalAWG.cm;

        let currentIndex = awgData.findIndex(w => w.awg === finalAWG.awg);
        while (voltageDrop > maxVoltageDrop) {
             const nextIndex = awgData.findIndex(w => w.cm > finalAWG.cm);
             if(nextIndex > -1) {
                finalAWG = awgData[nextIndex];
                voltageDrop = (2 * K * current * distance) / finalAWG.cm;
             } else {
                 setWireSizeResult({ error: "Distance is too long for a reasonable voltage drop. Consider a larger transformer or different voltage." });
                 return;
             }
        }
        
        setWireSizeResult({ awg: finalAWG.awg, voltageDrop: Number(voltageDrop.toFixed(2)), necArticle: "210.19(A)" });
    };
    
    const handleBoxFillCalculate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const conductorAWG = formData.get('conductor-awg-bf') as string;
        const hotCount = parseInt(formData.get('hots-bf') as string, 10) || 0;
        const neutralCount = parseInt(formData.get('neutrals-bf') as string, 10) || 0;
        const groundCount = parseInt(formData.get('grounds-bf') as string, 10) || 0;
        const deviceCount = parseInt(formData.get('devices-bf') as string, 10) || 0;
        const clampCount = parseInt(formData.get('clamps-bf') as string, 10) || 0;
        

        if (!conductorAWG) {
            setBoxFillResult({ error: "Please select a conductor AWG." });
            return;
        }

        const volumePerConductor: { [key: string]: number } = {
            "14": 2.00,
            "12": 2.25,
            "10": 2.50,
            "8": 3.00,
            "6": 5.00,
        };

        const unitVolume = volumePerConductor[conductorAWG];

        const totalConductors = hotCount + neutralCount;
        const totalDevices = deviceCount * 2; // Each device yoke counts as two conductors of the largest wire size connected to it
        const totalClamps = clampCount * 1; // Internal clamps count as one conductor allowance
        const totalGrounds = groundCount > 0 ? 1 : 0; // All ground wires combined count as one conductor allowance

        const totalConductorEquivalents = totalConductors + totalDevices + totalClamps + totalGrounds;
        const totalVolume = totalConductorEquivalents * unitVolume;

        const availableBoxSizes = Object.values(standardBoxSizes).sort((a,b) => a.volume - b.volume);
        const recommendedBox = availableBoxSizes.find(box => box.volume >= totalVolume);

        setBoxFillResult({ 
            totalVolume: Number(totalVolume.toFixed(2)), 
            necArticle: "314.16(B)",
            recommendedBox: recommendedBox
        });
    };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Calculation Tools</h1>
      </div>
      <Tabs defaultValue="ohms-law" className="w-full">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex">
            <TabsTrigger value="ohms-law">Ohm's Law</TabsTrigger>
            <TabsTrigger value="wire-sizing">Wire Sizing</TabsTrigger>
            <TabsTrigger value="box-fill">Box Fill</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="ohms-law">
          <Card>
            <form onSubmit={handleOhmsLawCalculate}>
                <CardHeader>
                  <CardTitle className="font-headline">Ohm's Law Calculator</CardTitle>
                  <CardDescription>Enter any two values to calculate the other two.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="voltage">Voltage (V)</Label>
                      <Input name="voltage" id="voltage" placeholder="e.g., 120" type="number" step="any"/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current">Current (A)</Label>
                      <Input name="current" id="current" placeholder="e.g., 15" type="number" step="any"/>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="resistance">Resistance (Ω)</Label>
                      <Input name="resistance" id="resistance" placeholder="e.g., 8" type="number" step="any"/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="power">Power (W)</Label>
                      <Input name="power" id="power" placeholder="e.g., 1800" type="number" step="any"/>
                    </div>
                  </div>
                   {ohmsResult && (
                      <Alert variant={ohmsResult.error ? "destructive" : "default"}>
                        {ohmsResult.error ? (
                          <>
                           <AlertCircle className="h-4 w-4" />
                           <AlertTitle>Error</AlertTitle>
                           <AlertDescription>{ohmsResult.error}</AlertDescription>
                          </>
                        ) : (
                          <>
                           <Lightbulb className="h-4 w-4" />
                           <AlertTitle>Calculated Results</AlertTitle>
                           <AlertDescription>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <span><Zap className="inline mr-2 size-4 text-primary"/>Voltage: <strong>{ohmsResult.v} V</strong></span>
                                <span><Sigma className="inline mr-2 size-4 text-primary"/>Resistance: <strong>{ohmsResult.r} Ω</strong></span>
                                <span><Scale className="inline mr-2 size-4 text-primary"/>Current: <strong>{ohmsResult.i} A</strong></span>
                                <span><Lightbulb className="inline mr-2 size-4 text-primary"/>Power: <strong>{ohmsResult.p} W</strong></span>
                            </div>
                           </AlertDescription>
                          </>
                        )}
                      </Alert>
                    )}
                </CardContent>
                <CardFooter>
                  <Button type="submit">Calculate</Button>
                </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="wire-sizing">
           <Card>
            <form onSubmit={handleWireSizingCalculate}>
                <CardHeader>
                  <CardTitle className="font-headline">Wire Sizing Calculator</CardTitle>
                  <CardDescription>Determine the appropriate wire gauge for your circuit based on voltage drop.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="voltage-ws">Voltage (V)</Label>
                        <Input name="voltage-ws" id="voltage-ws" placeholder="e.g., 120" type="number" step="any" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="current-ws">Current (A)</Label>
                        <Input name="current-ws" id="current-ws" placeholder="e.g., 20" type="number" step="any" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="distance-ws">One-way distance (feet)</Label>
                        <Input name="distance-ws" id="distance-ws" placeholder="e.g., 50" type="number" step="any" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="material-ws">Conductor Material</Label>
                         <Select name="material-ws">
                            <SelectTrigger id="material-ws">
                                <SelectValue placeholder="Select material" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="copper">Copper</SelectItem>
                                <SelectItem value="aluminum">Aluminum</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                  {wireSizeResult && (
                      <Alert variant={wireSizeResult.error ? "destructive" : "default"}>
                        {wireSizeResult.error ? (
                          <>
                           <AlertCircle className="h-4 w-4" />
                           <AlertTitle>Error</AlertTitle>
                           <AlertDescription>{wireSizeResult.error}</AlertDescription>
                          </>
                        ) : (
                          <>
                           <CheckCircle className="h-4 w-4" />
                           <AlertTitle>Recommended Wire Size</AlertTitle>
                           <AlertDescription>
                             <p className="font-bold text-lg text-primary">{wireSizeResult.awg} AWG</p>
                             <p>This ensures a voltage drop of no more than <strong>{wireSizeResult.voltageDrop}V (3%)</strong>.</p>
                             <p className="text-xs text-muted-foreground mt-2">Reference: NEC {wireSizeResult.necArticle} (Voltage Drop)</p>
                           </AlertDescription>
                          </>
                        )}
                      </Alert>
                    )}
                </CardContent>
                <CardFooter>
                  <Button type="submit">Calculate</Button>
                </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="box-fill">
           <Card>
            <form onSubmit={handleBoxFillCalculate}>
                <CardHeader>
                  <CardTitle className="font-headline">Box Fill Calculator</CardTitle>
                  <CardDescription>Calculate the minimum required electrical box volume based on NEC 314.16.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Largest Conductor (AWG)</Label>
                         <Select name="conductor-awg-bf">
                            <SelectTrigger>
                                <SelectValue placeholder="e.g., 12 AWG" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="14">14 AWG</SelectItem>
                                <SelectItem value="12">12 AWG</SelectItem>
                                <SelectItem value="10">10 AWG</SelectItem>
                                <SelectItem value="8">8 AWG</SelectItem>
                                <SelectItem value="6">6 AWG</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                   <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="hots-bf"># of Hot Wires</Label>
                        <Input name="hots-bf" id="hots-bf" placeholder="e.g., 2" type="number" defaultValue="0"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="neutrals-bf"># of Neutral Wires</Label>
                        <Input name="neutrals-bf" id="neutrals-bf" placeholder="e.g., 2" type="number" defaultValue="0"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="grounds-bf"># of Ground Wires</Label>
                        <Input name="grounds-bf" id="grounds-bf" placeholder="e.g., 1" type="number" defaultValue="0"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="devices-bf"># of Devices</Label>
                        <Input name="devices-bf" id="devices-bf" placeholder="e.g., 1" type="number" defaultValue="0"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="clamps-bf"># of Clamps</Label>
                        <Input name="clamps-bf" id="clamps-bf" placeholder="e.g., 0" type="number" defaultValue="0"/>
                    </div>
                  </div>
                   {boxFillResult && (
                      <Alert variant={boxFillResult.error ? "destructive" : "default"}>
                        {boxFillResult.error ? (
                          <>
                           <AlertCircle className="h-4 w-4" />
                           <AlertTitle>Error</AlertTitle>
                           <AlertDescription>{boxFillResult.error}</AlertDescription>
                          </>
                        ) : (
                          <>
                           <Box className="h-4 w-4" />
                           <AlertTitle>Calculation Result</AlertTitle>
                           <AlertDescription>
                             <p>Total Required Volume: <strong className="text-primary">{boxFillResult.totalVolume} in³</strong></p>
                             {boxFillResult.recommendedBox ? (
                                <p>Suggested Box: <strong className="text-primary">{boxFillResult.recommendedBox.type}</strong> ({boxFillResult.recommendedBox.volume} in³)</p>
                             ) : (
                                <p>No standard box found for this volume. A larger or custom box is required.</p>
                             )}
                             <p className="text-xs text-muted-foreground mt-2">Reference: NEC {boxFillResult.necArticle}</p>
                           </AlertDescription>
                          </>
                        )}
                      </Alert>
                    )}
                </CardContent>
                <CardFooter>
                  <Button type="submit">Calculate</Button>
                </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

    