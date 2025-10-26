import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CalculatorsPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Calculation Tools</h1>
      </div>
      <Tabs defaultValue="ohms-law" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="ohms-law">Ohm's Law</TabsTrigger>
          <TabsTrigger value="wire-sizing">Wire Sizing</TabsTrigger>
          <TabsTrigger value="box-fill">Box Fill</TabsTrigger>
        </TabsList>
        <TabsContent value="ohms-law">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Ohm's Law Calculator</CardTitle>
              <CardDescription>Calculate Voltage, Current, Resistance, or Power.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="voltage">Voltage (V)</Label>
                  <Input id="voltage" placeholder="e.g., 120" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current">Current (A)</Label>
                  <Input id="current" placeholder="e.g., 15" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resistance">Resistance (Ω)</Label>
                  <Input id="resistance" placeholder="e.g., 8" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="power">Power (W)</Label>
                  <Input id="power" placeholder="e.g., 1800" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Calculate</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="wire-sizing">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline">Wire Sizing Calculator</CardTitle>
              <CardDescription>Determine the appropriate wire gauge for your circuit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="voltage-ws">Voltage (V)</Label>
                    <Input id="voltage-ws" placeholder="e.g., 120" type="number" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="current-ws">Current (A)</Label>
                    <Input id="current-ws" placeholder="e.g., 20" type="number" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="distance-ws">One-way distance (feet)</Label>
                    <Input id="distance-ws" placeholder="e.g., 50" type="number" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="material-ws">Conductor Material</Label>
                     <Select>
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
            </CardContent>
            <CardFooter>
              <Button>Calculate</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="box-fill">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline">Box Fill Calculator</CardTitle>
              <CardDescription>Calculate the minimum required electrical box size.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                    <Label>Conductors (AWG)</Label>
                     <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="e.g., 14 AWG" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="14">14 AWG</SelectItem>
                            <SelectItem value="12">12 AWG</SelectItem>
                            <SelectItem value="10">10 AWG</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="conductors-bf">Number</Label>
                    <Input id="conductors-bf" placeholder="e.g., 4" type="number" />
                </div>
                 <Button variant="secondary" >Add Conductor</Button>
              </div>
               <div className="grid sm:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                    <Label>Devices (Switches, Outlets)</Label>
                    <Input placeholder="e.g., 2" type="number" />
                </div>
                 <div className="space-y-2">
                    <Label>Clamps</Label>
                    <Input placeholder="e.g., 1" type="number" />
                </div>
                 <div className="space-y-2">
                    <Label>Ground Wires</Label>
                    <Input placeholder="e.g., 1" type="number" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Calculate</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
