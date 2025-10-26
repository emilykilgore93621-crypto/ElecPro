
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Save, 
  Printer,
  MousePointer,
  Lightbulb,
  ToggleLeft,
  Box,
  Spline,
  Type,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

const tools = [
    { id: "select", icon: MousePointer, label: "Select" },
    { id: "outlet", icon: ToggleLeft, label: "Outlet", transform: 'rotate(90deg)' },
    { id: "switch", icon: ToggleLeft, label: "Switch" },
    { id: "light", icon: Lightbulb, label: "Light" },
    { id: "junction-box", icon: Box, label: "Junction Box" },
    { id: "wire", icon: Spline, label: "Wire" },
    { id: "label", icon: Type, label: "Label" },
]

type CanvasElement = {
    id: number;
    type: string;
    x: number;
    y: number;
    icon: React.ElementType;
    label: string;
    transform?: string;
};

const componentMap: { [key: string]: Omit<CanvasElement, 'id' | 'x' | 'y'> } = {
    'outlet': { type: 'outlet', icon: ToggleLeft, label: 'Outlet', transform: 'rotate(90deg)' },
    'switch': { type: 'switch', icon: ToggleLeft, label: 'Switch' },
    'light': { type: 'light', icon: Lightbulb, label: 'Light' },
    'junction-box': { type: 'junction-box', icon: Box, label: 'J-Box' },
    'label': {type: 'label', icon: Type, label: 'Label'},
};


export default function CanvasPage() {
    const [activeTool, setActiveTool] = useState("select");
    const [elements, setElements] = useState<CanvasElement[]>([]);
    
    const gridSize = 20;

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (activeTool === 'select' || activeTool === 'wire') return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Snap to grid
        const snappedX = Math.round(x / gridSize) * gridSize;
        const snappedY = Math.round(y / gridSize) * gridSize;
        
        const component = componentMap[activeTool];
        if(component) {
             const newElement: CanvasElement = {
                id: Date.now(),
                ...component,
                x: snappedX,
                y: snappedY,
            };
            setElements(prev => [...prev, newElement]);
        }
    };

    const clearCanvas = () => {
        setElements([]);
    }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Interactive Canvas</h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={clearCanvas}>
                <Trash2 className="mr-2 h-4 w-4"/>
                Clear
            </Button>
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
        <Card className="w-full md:w-auto">
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
        <Card className="flex-1 relative">
            <CardContent 
                className="h-full w-full bg-grid-slate-100 dark:bg-grid-slate-700/50 rounded-lg cursor-crosshair"
                style={{
                    backgroundSize: `${gridSize}px ${gridSize}px`,
                    backgroundImage: 'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
                }}
                onClick={handleCanvasClick}
            >
                {elements.map(el => {
                    const Icon = el.icon;
                    return (
                        <div 
                            key={el.id}
                            className="absolute flex flex-col items-center"
                            style={{ left: el.x - 16, top: el.y - 16 }}
                        >
                            <Icon 
                                className="h-8 w-8 text-primary" 
                                style={{ transform: el.transform }} 
                            />
                            <span className="text-xs">{el.label}</span>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
