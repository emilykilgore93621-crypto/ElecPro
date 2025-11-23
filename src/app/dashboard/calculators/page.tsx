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
import { Lightbulb, AlertCircle, CheckCircle, Scale, Sigma, Zap, Box, LayoutPanelTop, Waypoints, Ruler, Equal, Divide, X, Info } from "lucide-react";


const standardBoxSizes: { [key: string]: { volume: number, type: string } } = {
    "12.5": { volume: 12.5, type: "Single-gang handy box (4 x 2 1/8 x 1 7/8)" },
    "14": { volume: 14, type: "Single-gang switch box (3 x 2 x 2 1/2)" },
    "18": { volume: 18, type: "Single-gang switch box (3 x 2 x 3 1/2)" },
    "21": { volume: 21, type: "4-inch square box (4 x 4 x 1 1/2)" },
    "25.5": { volume: 25.5, type: "Double-gang masonry box (3 3/4 x 3 3/4 x 2 1/2)" },
    "30.3": { volume: 30.3, type: "4-inch square box (4 x 4 x 2 1/8)" },
    "42": { volume: 42, type: "4-11/16 inch square box (4 11/16 x 4 11/16 x 2 1/8)" },
};

// NEC Chapter 9, Table 4 for conduit areas (in²)
const conduitAreas: { [type: string]: { [size: string]: number } } = {
    "EMT": { "1/2": 0.304, "3/4": 0.533, "1": 0.864, "1 1/4": 1.501, "1 1/2": 2.036, "2": 3.356 },
    "RMC": { "1/2": 0.314, "3/4": 0.556, "1": 0.849, "1 1/4": 1.526, "1 1/2": 2.084, "2": 3.356 },
    "PVC Sch 40": { "1/2": 0.283, "3/4": 0.505, "1": 0.817, "1 1/4": 1.457, "1 1/2": 1.986, "2": 3.262 },
    "LFMC": { "1/2": 0.292, "3/4": 0.518, "1": 0.849, "1 1/4": 1.457, "1 1/2": 1.986, "2": 3.234 },
};

// NEC Chapter 9, Table 5 for THHN/THWN conductor areas (in²)
const conductorAreas: { [awg: string]: number } = {
    "14": 0.00323,
    "12": 0.00479,
    "10": 0.00755,
    "8": 0.0132,
    "6": 0.0185,
    "4": 0.0295,
    "2": 0.0465,
};

export default function CalculatorsPage() {
    const [ohmsResult, setOhmsResult] = useState<{ v?: number, i?: number, r?: number, p?: number, error?: string } | null>(null);
    const [wireSizeResult, setWireSizeResult] = useState<{ awg?: string, voltageDrop?: number, necArticle?: string, error?: string } | null>(null);
    const [boxFillResult, setBoxFillResult] = useState<{ totalVolume?: number, necArticle?: string, recommendedBox?: { volume: number, type: string }, error?: string } | null>(null);
    const [panelSizeResult, setPanelSizeResult] = useState<{ panelAmps?: number, minSpaces?: number, necArticle?: string, notes?: string[], error?: string } | null>(null);
    const [conduitFillResult, setConduitFillResult] = useState<{ maxConductors?: number, fillPercentage?: number, necArticle?: string, error?: string, notes?: string[] } | null>(null);

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

    const handlePanelSizingCalculate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const load = parseFloat(formData.get('load-ps') as string);
        const circuits = parseInt(formData.get('circuits-ps') as string, 10);
        const panelType = formData.get('panel-type-ps') as string;

        if (isNaN(load) || isNaN(circuits)) {
            setPanelSizeResult({ error: "Please fill out all fields." });
            return;
        }

        const panelSizes = [100, 125, 150, 200, 225, 400];
        const recommendedPanelAmps = panelSizes.find(size => size >= load) || panelSizes[panelSizes.length - 1];

        const spaceTiers = [
            { circuits: 12, spaces: 20 },
            { circuits: 20, spaces: 30 },
            { circuits: 30, spaces: 40 },
            { circuits: 40, spaces: 42 },
        ];
        let minSpaces = circuits + Math.ceil(circuits * 0.25); // Add 25% for future expansion
        const recommendedSpaces = spaceTiers.find(tier => tier.circuits >= circuits)?.spaces || 42;
        minSpaces = Math.max(minSpaces, recommendedSpaces);
        // Round up to nearest even number
        minSpaces = Math.ceil(minSpaces / 2) * 2;


        let notes = [
            "Always verify with a qualified electrician and local codes.",
            "PGE Greenbook may have specific requirements for service equipment location and clearances.",
            "NFPA 70 (NEC) contains detailed requirements for panel installation."
        ];
        
        if(panelType === 'main') {
            notes.push("Main panel requires a main breaker and proper service grounding (NEC 250).");
        } else {
            notes.push("Subpanel requires a separate ground bar if in a detached structure (NEC 250.32).");
        }


        setPanelSizeResult({
            panelAmps: recommendedPanelAmps,
            minSpaces: minSpaces,
            necArticle: "220 (Load Calc), 408 (Panels)",
            notes: notes,
        });
    };
    
    const handleConduitFillCalculate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const conduitType = formData.get('conduit-type-cf') as string;
        const conduitSize = formData.get('conduit-size-cf') as string;
        const conductorAWG = formData.get('conductor-awg-cf') as string;
        const numConductors = parseInt(formData.get('num-conductors-cf') as string, 10) || 0;

        if (!conduitType || !conduitSize || !conductorAWG) {
            setConduitFillResult({ error: "Please fill out all fields." });
            return;
        }
        
        const fillPercent = numConductors > 2 ? 0.40 : (numConductors === 2 ? 0.31 : 0.53);
        const totalConduitArea = conduitAreas[conduitType]?.[conduitSize];
        const singleConductorArea = conductorAreas[conductorAWG];

        if(!totalConduitArea || !singleConductorArea) {
             setConduitFillResult({ error: "Could not find data for the selected combination." });
            return;
        }

        const maxConductors = Math.floor((totalConduitArea * (numConductors > 2 ? 0.40 : 0.31)) / singleConductorArea);
        
        let currentFill = 0;
        if(numConductors > 0){
             currentFill = (numConductors * singleConductorArea / totalConduitArea) * 100;
        }

        const notes = [
            "DO: Ream conduit ends to remove sharp edges.",
            "DON'T: Exceed 360 degrees of bends between pull points.",
            "DO: Use expansion fittings for long runs of PVC in areas with temperature swings.",
            "DON'T: Use EMT in wet locations or where subject to severe physical damage.",
            "DO: Secure and support conduit at required intervals (e.g., every 10 ft for EMT).",
        ];

        setConduitFillResult({
            maxConductors: maxConductors,
            fillPercentage: Number(currentFill.toFixed(1)),
            necArticle: "Chapter 9, Table 1",
            notes: notes
        });
    }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Circuit Crunches</h1>
      </div>
      <Tabs defaultValue="ohms-law" className="w-full">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex">
            <TabsTrigger value="ohms-law" className="flex items-center gap-2"><Sigma />Ohm's Law</TabsTrigger>
            <TabsTrigger value="wire-sizing" className="flex items-center gap-2"><Ruler />Wire Sizing</TabsTrigger>
            <TabsTrigger value="box-fill" className="flex items-center gap-2"><Box />Box Fill</TabsTrigger>
            <TabsTrigger value="panel-sizing" className="flex items-center gap-2"><LayoutPanelTop />Panel Sizing</TabsTrigger>
            <TabsTrigger value="conduit-fill" className="flex items-center gap-2"><Waypoints />Conduit Fill</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="ohms-law">
          <Card>
            <form onSubmit={handleOhmsLawCalculate}>
                <CardHeader>
                  <CardTitle className="font-headline">Ohm's Law Calculator</CardTitle>
                  <CardDescription>A fundamental formula describing the relationship between voltage (V), current (I), and resistance (R).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert variant="default" className="bg-muted/50">
                      <Info className="h-4 w-4" />
                      <AlertTitle className="font-semibold font-code flex items-center gap-2">V <Equal className="size-3"/> I <X className="size-3"/> R</AlertTitle>
                      <AlertDescription>
                        Voltage (V) = Current (I) × Resistance (R). Enter any two values to calculate the others.
                      </AlertDescription>
                  </Alert>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="voltage">Voltage (V)</Label>
                      <Input name="voltage" id="voltage" placeholder="e.g., 120" type="number" step="any"/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current">Current (I)</Label>
                      <Input name="current" id="current" placeholder="e.g., 15" type="number" step="any"/>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="resistance">Resistance (R)</Label>
                      <Input name="resistance" id="resistance" placeholder="e.g., 8" type="number" step="any"/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="power">Power (P)</Label>
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
                  <CardDescription>Determine the minimum wire gauge to avoid excessive voltage drop.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <Alert variant="default" className="bg-muted/50">
                      <Info className="h-4 w-4" />
                      <AlertTitle className="font-semibold font-code flex items-center gap-1">VD <Equal className="size-3"/> (2 <X className="size-3"/> K <X className="size-3"/> I <X className="size-3"/> D) <Divide className="size-3"/> CM</AlertTitle>
                      <AlertDescription>
                        Calculates Voltage Drop (VD) based on conductor material (K), current (I), distance (D), and circular mils (CM).
                      </AlertDescription>
                  </Alert>
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
                    <Alert variant="default" className="bg-muted/50">
                      <Info className="h-4 w-4" />
                      <AlertTitle className="font-semibold">NEC 314.16(B)</AlertTitle>
                      <AlertDescription>
                        Each conductor, device, and clamp in a box has a volume allowance. This calculator sums those allowances to find the minimum box size.
                      </AlertDescription>
                  </Alert>
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
        <TabsContent value="panel-sizing">
           <Card>
            <form onSubmit={handlePanelSizingCalculate}>
                <CardHeader>
                  <CardTitle className="font-headline">Panel Sizing Calculator</CardTitle>
                  <CardDescription>Estimate the minimum panel ampacity and number of breaker spaces for a service or subpanel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert variant="default" className="bg-muted/50">
                      <Info className="h-4 w-4" />
                      <AlertTitle className="font-semibold">NEC Article 220</AlertTitle>
                      <AlertDescription>
                        Proper panel sizing is determined by a load calculation. This tool provides an estimate, but a full load calculation is required for permitting.
                      </AlertDescription>
                  </Alert>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="load-ps">Calculated Load (Amps)</Label>
                        <Input name="load-ps" id="load-ps" placeholder="e.g., 85" type="number" step="any" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="circuits-ps"># of Circuits</Label>
                        <Input name="circuits-ps" id="circuits-ps" placeholder="e.g., 22" type="number" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="panel-type-ps">Panel Type</Label>
                         <Select name="panel-type-ps" defaultValue="main">
                            <SelectTrigger id="panel-type-ps">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="main">Main Service Panel</SelectItem>
                                <SelectItem value="sub">Subpanel</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                  {panelSizeResult && (
                      <Alert variant={panelSizeResult.error ? "destructive" : "default"}>
                        {panelSizeResult.error ? (
                          <>
                           <AlertCircle className="h-4 w-4" />
                           <AlertTitle>Error</AlertTitle>
                           <AlertDescription>{panelSizeResult.error}</AlertDescription>
                          </>
                        ) : (
                          <>
                           <LayoutPanelTop className="h-4 w-4" />
                           <AlertTitle>Recommended Panel Size</AlertTitle>
                           <AlertDescription>
                             <p>Minimum Panel Rating: <strong className="text-primary">{panelSizeResult.panelAmps}A</strong></p>
                             <p>Minimum Breaker Spaces: <strong className="text-primary">{panelSizeResult.minSpaces}</strong></p>
                             <div className="mt-4">
                                <h4 className="font-semibold">Notes & Considerations:</h4>
                                <ul className="list-disc pl-5 mt-1 text-xs space-y-1">
                                    {panelSizeResult.notes?.map((note, i) => <li key={i}>{note}</li>)}
                                </ul>
                             </div>
                             <p className="text-xs text-muted-foreground mt-2">Reference: NEC {panelSizeResult.necArticle}</p>
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
         <TabsContent value="conduit-fill">
           <Card>
            <form onSubmit={handleConduitFillCalculate}>
                <CardHeader>
                  <CardTitle className="font-headline">Conduit Fill Calculator</CardTitle>
                  <CardDescription>Calculate how many wires can safely fit in a specific type and size of conduit.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert variant="default" className="bg-muted/50">
                      <Info className="h-4 w-4" />
                      <AlertTitle className="font-semibold">NEC Chapter 9, Table 1</AlertTitle>
                      <AlertDescription>
                        Fill percentage is limited to prevent heat buildup and damage to wire insulation. (40% for EMT, 31% for wires).
                      </AlertDescription>
                  </Alert>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="conduit-type-cf">Conduit Type</Label>
                         <Select name="conduit-type-cf">
                            <SelectTrigger id="conduit-type-cf">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(conduitAreas).map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="conduit-size-cf">Conduit Size</Label>
                         <Select name="conduit-size-cf">
                            <SelectTrigger id="conduit-size-cf">
                                <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(conduitAreas["EMT"]).map(size => <SelectItem key={size} value={size}>{size}"</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="conductor-awg-cf">Conductor (THHN/THWN)</Label>
                         <Select name="conductor-awg-cf">
                            <SelectTrigger id="conductor-awg-cf">
                                <SelectValue placeholder="Select AWG" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(conductorAreas).map(awg => <SelectItem key={awg} value={awg}>{awg} AWG</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                  <div className="space-y-2 max-w-xs">
                        <Label htmlFor="num-conductors-cf">Number of Conductors</Label>
                        <Input name="num-conductors-cf" id="num-conductors-cf" placeholder="e.g., 3" type="number" />
                  </div>
                  {conduitFillResult && (
                      <Alert variant={conduitFillResult.error ? "destructive" : "default"}>
                        {conduitFillResult.error ? (
                          <>
                           <AlertCircle className="h-4 w-4" />
                           <AlertTitle>Error</AlertTitle>
                           <AlertDescription>{conduitFillResult.error}</AlertDescription>
                          </>
                        ) : (
                          <>
                           <Waypoints className="h-4 w-4" />
                           <AlertTitle>Conduit Fill Result</AlertTitle>
                           <AlertDescription>
                             <p>
                                Max <strong className="text-primary">{conduitFillResult.maxConductors}</strong> conductors allowed for 40% fill.
                             </p>
                              {conduitFillResult.fillPercentage !== undefined && conduitFillResult.fillPercentage > 0 && (
                                <p>Your current configuration is at <strong className={conduitFillResult.fillPercentage > 40 ? "text-destructive" : "text-primary"}>{conduitFillResult.fillPercentage}%</strong> fill.</p>
                              )}
                              <div className="mt-4">
                                <h4 className="font-semibold">Residential Do's & Don'ts:</h4>
                                <ul className="list-disc pl-5 mt-1 text-xs space-y-1">
                                    {conduitFillResult.notes?.map((note, i) => {
                                        const isDont = note.startsWith("DON'T");
                                        return <li key={i} className={isDont ? "text-destructive" : "text-muted-foreground"}>{note}</li>
                                    })}
                                </ul>
                             </div>
                             <p className="text-xs text-muted-foreground mt-2">Reference: NEC {conduitFillResult.necArticle}</p>
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
