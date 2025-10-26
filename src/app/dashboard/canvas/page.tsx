
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
import React, { useState, MouseEvent, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";

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
    icon?: React.ElementType;
    label: string;
    transform?: string;
    isEditing?: boolean;
};

type Wire = {
    id: number;
    startElementId: number;
    endElementId: number;
}

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
    const [wires, setWires] = useState<Wire[]>([]);
    const [wiringStartElement, setWiringStartElement] = useState<CanvasElement | null>(null);
    const [draggingElement, setDraggingElement] = useState<{ id: number; offsetX: number; offsetY: number } | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const editInputRef = useRef<HTMLInputElement>(null);
    
    const gridSize = 20;
    
    useEffect(() => {
        if (editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [elements]);


    const getCanvasCoordinates = (e: MouseEvent, canvasEl: HTMLDivElement | null): { x: number; y: number } => {
        if (!canvasEl) return { x: 0, y: 0 };
        const rect = canvasEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x, y };
    };

    const handleCanvasClick = (e: MouseEvent<HTMLDivElement>) => {
        // Prevent adding new elements if we clicked on an existing one
        if (e.target !== e.currentTarget) {
            // If clicking off an element, disable any active editing states
            setElements(prev => prev.map(el => ({ ...el, isEditing: false })));
            return;
        };

        if (activeTool === 'select' || activeTool === 'wire' || draggingElement) {
            setWiringStartElement(null); // Deselect wiring start if clicking on canvas background
            return;
        }

        const { x, y } = getCanvasCoordinates(e, e.currentTarget);

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
                isEditing: component.type === 'label', // Immediately start editing if it's a label
            };
            setElements(prev => [...prev, newElement]);
        }
    };
    
    const handleElementMouseDown = (e: MouseEvent<HTMLDivElement>, element: CanvasElement) => {
        e.stopPropagation();
        if (activeTool === 'select') {
            if (!canvasRef.current) return;
            const { x: mouseX, y: mouseY } = getCanvasCoordinates(e, canvasRef.current);
            
            const offsetX = mouseX - element.x;
            const offsetY = mouseY - element.y;

            setDraggingElement({ id: element.id, offsetX, offsetY });
        } else if (activeTool === 'wire') {
             if (!wiringStartElement) {
                setWiringStartElement(element);
            } else {
                // Prevent wiring to the same element
                if (wiringStartElement.id === element.id) return;
                
                const newWire: Wire = {
                    id: Date.now(),
                    startElementId: wiringStartElement.id,
                    endElementId: element.id,
                };
                setWires(prev => [...prev, newWire]);
                setWiringStartElement(null); // Reset after creating wire
            }
        }
    };
    
    const handleElementDoubleClick = (elementId: number) => {
        const element = elements.find(el => el.id === elementId);
        if (element && element.type === 'label') {
            setElements(prev => prev.map(el => el.id === elementId ? { ...el, isEditing: true } : { ...el, isEditing: false }));
        }
    };

    const handleLabelChange = (e: ChangeEvent<HTMLInputElement>, elementId: number) => {
        setElements(prev => prev.map(el => el.id === elementId ? { ...el, label: e.target.value } : el));
    };

    const handleLabelKeyDown = (e: KeyboardEvent<HTMLInputElement>, elementId: number) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            setElements(prev => prev.map(el => el.id === elementId ? { ...el, isEditing: false } : el));
        }
    };

    const handleCanvasMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!draggingElement || !canvasRef.current) return;

        const { x, y } = getCanvasCoordinates(e, canvasRef.current);

        const newX = x - draggingElement.offsetX;
        const newY = y - draggingElement.offsetY;

        const snappedX = Math.round(newX / gridSize) * gridSize;
        const snappedY = Math.round(newY / gridSize) * gridSize;

        setElements(prevElements =>
            prevElements.map(el =>
                el.id === draggingElement.id ? { ...el, x: snappedX, y: snappedY } : el
            )
        );
    };

    const handleCanvasMouseUp = () => {
        setDraggingElement(null);
    };


    const clearCanvas = () => {
        setElements([]);
        setWires([]);
        setWiringStartElement(null);
    }
    
    const getElementById = (id: number) => elements.find(el => el.id === id);


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
                        onClick={() => {
                            setActiveTool(tool.id);
                            setWiringStartElement(null); // Deselect any wiring start when changing tools
                        }}
                        title={tool.label}
                    >
                        <tool.icon style={{ transform: tool.transform }} />
                    </Button>
                ))}
            </CardContent>
        </Card>
        <Card className="flex-1 relative">
            <CardContent 
                ref={canvasRef}
                className={cn(
                  "h-full w-full bg-grid-slate-100 dark:bg-grid-slate-700/50 rounded-lg relative",
                  activeTool === 'select' ? 'cursor-default' : 'cursor-crosshair'
                )}
                style={{
                    backgroundSize: `${gridSize}px ${gridSize}px`,
                    backgroundImage: 'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
                }}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
            >
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {wires.map(wire => {
                        const startEl = getElementById(wire.startElementId);
                        const endEl = getElementById(wire.endElementId);
                        if(!startEl || !endEl) return null;
                        
                        return (
                            <line
                                key={wire.id}
                                x1={startEl.x}
                                y1={startEl.y}
                                x2={endEl.x}
                                y2={endEl.y}
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                            />
                        )
                    })}
                </svg>

                {elements.map(el => {
                    const Icon = el.icon;
                    const isWiringStart = wiringStartElement?.id === el.id;
                    const isLabel = el.type === 'label';
                    
                    return (
                        <div 
                            key={el.id}
                            className={cn(
                              "absolute flex flex-col items-center",
                              !isLabel && "p-2 rounded-full",
                              activeTool === 'select' && 'cursor-grab',
                              activeTool === 'wire' && 'cursor-pointer',
                              draggingElement?.id === el.id && 'cursor-grabbing',
                              isWiringStart && 'bg-primary/20 ring-2 ring-primary'
                            )}
                            style={{ 
                                left: el.x - (isLabel ? 40 : 24), 
                                top: el.y - (isLabel ? 12 : 24), 
                                zIndex: draggingElement?.id === el.id ? 10 : 1,
                                minWidth: isLabel ? '80px' : 'auto',
                            }}
                            onMouseDown={(e) => handleElementMouseDown(e, el)}
                            onDoubleClick={() => handleElementDoubleClick(el.id)}
                        >
                            {Icon && (
                                <Icon 
                                    className="h-8 w-8 text-primary pointer-events-none" 
                                    style={{ transform: el.transform }} 
                                />
                            )}
                            {isLabel && el.isEditing ? (
                                <input
                                    ref={editInputRef}
                                    type="text"
                                    value={el.label}
                                    onChange={(e) => handleLabelChange(e, el.id)}
                                    onKeyDown={(e) => handleLabelKeyDown(e, el.id)}
                                    onBlur={() => setElements(prev => prev.map(elem => elem.id === el.id ? { ...elem, isEditing: false } : elem))}
                                    className="text-xs text-center bg-transparent border border-primary rounded px-1 py-0.5 w-full pointer-events-auto"
                                />
                            ) : (
                                <span className="text-xs pointer-events-none select-none text-center">{el.label}</span>
                            )}
                        </div>
                    )
                })}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    

    