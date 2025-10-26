
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Save, 
  Share2, 
  Printer,
  MousePointer,
  Lightbulb,
  ToggleLeft,
  Box,
  Spline,
  Type
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const tools = [
    { id: "select", icon: MousePointer, label: "Select" },
    { id: "outlet", icon: ToggleLeft, transform: 'rotate(90)', label: "Outlet" },
    { id: "switch", icon: ToggleLeft, label: "Switch" },
    { id: "light", icon: Lightbulb, label: "Light" },
    { id: "junction-box", icon: Box, label: "Junction Box" },
    { id: "wire", icon: Spline, label: "Wire" },
    { id: "label", icon: Type, label: "Label" },
]

export default function CanvasPage() {
    const [activeTool, setActiveTool] = useState("select");

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Interactive Canvas</h1>
        <div className="flex gap-2">
            <Button variant="outline" disabled>
                <Save className="mr-2 h-4 w-4"/>
                Save
            </Button>
            <Button disabled>
                <Printer className="mr-2 h-4 w-4" />
                Print / Export
            </Button>
        </div>
      </div>
      <div className="flex-1 flex gap-4 flex-col md:flex-row">
        <Card className="w-full md:w-16">
            <CardContent className="p-2 flex md:flex-col gap-2 justify-center">
                 {tools.map(tool => (
                    <Button 
                        key={tool.id}
                        variant={activeTool === tool.id ? "secondary" : "ghost"}
                        size="icon"
                        className="w-12 h-12"
                        onClick={() => setActiveTool(tool.id)}
                        title={tool.label}
                    >
                        <tool.icon style={{ transform: tool.transform }} />
                    </Button>
                ))}
            </CardContent>
        </Card>
        <Card className="flex-1">
            <CardContent 
                className="h-full w-full bg-grid-slate-100 dark:bg-grid-slate-700/50 rounded-lg"
                style={{
                    backgroundSize: '20px 20px',
                    backgroundImage: 'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
                }}
            >
                {/* Canvas area will go here */}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add bg-grid-slate-100 and dark:bg-grid-slate-700/50 to globals or tailwind config if needed. For now, it's just a placeholder classname.
