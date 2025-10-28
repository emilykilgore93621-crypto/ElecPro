
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Save, 
  Printer,
  MousePointer,
  Lightbulb,
  ToggleLeft,
  Box,
  Spline,
  Type,
  Trash2,
  ChevronDown,
  Waypoints,
  Wind,
  Power,
  Usb,
  FileImage,
  FileText,
  Lock,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState, MouseEvent, useRef, useEffect, ChangeEvent, KeyboardEvent, useMemo } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useFirebase } from "@/firebase";
import { collection, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";


type Tool = {
  id: string;
  icon: React.ElementType;
  label: string;
  transform?: string;
  subTools?: Omit<Tool, 'subTools'>[];
};

const tools: Tool[] = [
    { id: "select", icon: MousePointer, label: "Select" },
    { 
        id: "outlets", 
        icon: Power, 
        label: "Outlet",
        subTools: [
            { id: "outlet", icon: ToggleLeft, label: "Standard Outlet", transform: 'rotate(90deg)' },
            { id: "usb-outlet", icon: Usb, label: "USB Outlet" },
            { id: "gfci-outlet", icon: ToggleLeft, label: "GFCI Outlet", transform: 'rotate(90deg)' },
        ]
    },
    { 
        id: "switches", 
        icon: ToggleLeft, 
        label: "Switch",
        subTools: [
            { id: "switch", icon: ToggleLeft, label: "Switch" },
            { id: "3-way-switch", icon: Waypoints, label: "3-Way Switch" },
            { id: "4-way-switch", icon: Waypoints, label: "4-Way Switch" },
        ]
    },
    { 
        id: "fixtures", 
        icon: Lightbulb, 
        label: "Fixture",
        subTools: [
             { id: "light", icon: Lightbulb, label: "Light Fixture" },
             { id: "ceiling-fan", icon: Wind, label: "Ceiling Fan" },
             { id: "smart-switch", icon: ToggleLeft, label: "Smart Switch" },
        ]
    },
    { id: "junction-box", icon: Box, label: "Junction Box" },
    { id: "wire", icon: Spline, label: "Wire" },
    { id: "label", icon: Type, label: "Label" },
];

type CanvasElement = {
    id: number;
    type: string;
    x: number;
    y: number;
    label: string;
    transform?: string;
    isEditing?: boolean;
};

// Stripping icon before saving to firestore
type SerializableCanvasElement = Omit<CanvasElement, 'icon'>;


type Wire = {
    id: number;
    startElementId: number;
    endElementId: number;
}

const componentMap: { [key: string]: {type: string, label: string, transform?: string } } = {
    'outlet': { type: 'outlet', label: 'Outlet', transform: 'rotate(90deg)' },
    'usb-outlet': { type: 'usb-outlet', label: 'USB Outlet' },
    'gfci-outlet': { type: 'gfci-outlet', label: 'GFCI', transform: 'rotate(90deg)' },
    'switch': { type: 'switch', label: 'Switch' },
    '3-way-switch': { type: '3-way-switch', label: '3-Way Sw' },
    '4-way-switch': { type: '4-way-switch', label: '4-Way Sw' },
    'light': { type: 'light', label: 'Light' },
    'ceiling-fan': { type: 'ceiling-fan', label: 'Ceiling Fan' },
    'smart-switch': { type: 'smart-switch', label: 'Smart Sw' },
    'junction-box': { type: 'junction-box', label: 'J-Box' },
    'label': {type: 'label', label: 'Label'},
};


const componentIconMap: { [key: string]: React.ElementType } = {
    'outlet': ToggleLeft,
    'usb-outlet': Usb,
    'gfci-outlet': ToggleLeft,
    'switch': ToggleLeft,
    '3-way-switch': Waypoints,
    '4-way-switch': Waypoints,
    'light': Lightbulb,
    'ceiling-fan': Wind,
    'smart-switch': ToggleLeft,
    'junction-box': Box,
    'label': Type
};



export default function CanvasPage({ subscriptionStatus, handleUpgrade }: { subscriptionStatus: string | null, handleUpgrade: () => void }) {
    const [activeTool, setActiveTool] = useState("select");
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [wires, setWires] = useState<Wire[]>([]);
    const [wiringStartElement, setWiringStartElement] = useState<CanvasElement | null>(null);
    const [draggingElement, setDraggingElement] = useState<{ id: number; offsetX: number; offsetY: number } | null>(null);
    const [showTakeoff, setShowTakeoff] = useState(true);
    const canvasRef = useRef<HTMLDivElement>(null);
    const editInputRef = useRef<HTMLInputElement>(null);
    const { firestore, user } = useFirebase();
    const { toast } = useToast();
    
    const gridSize = 20;
    
    useEffect(() => {
        if (editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [elements]);

    if (subscriptionStatus !== 'pro') {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center">
              <Card className="max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 font-headline text-2xl"><Lock className="text-primary size-8"/> Feature Locked</CardTitle>
                    <CardDescription>
                        The Blueprint Board is a Pro feature. Please upgrade your plan to design and save your electrical diagrams.
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

    const handleSave = () => {
        if (!firestore || !user) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'You must be logged in to save.',
            });
            return;
        }

        const serializableElements: SerializableCanvasElement[] = elements.map(({ ...rest }) => rest);

        const canvasData = {
            elements: serializableElements,
            wires: wires,
            createdAt: serverTimestamp(),
            userId: user.uid,
        };

        const canvasesColRef = collection(firestore, 'users', user.uid, 'canvases');
        addDocumentNonBlocking(canvasesColRef, canvasData);
        
        toast({
            title: 'Canvas Saved',
            description: 'Your canvas has been saved successfully.',
        });
    };

    const takeoffList = useMemo(() => {
        const counts: { [key: string]: number } = {};

        const allComponentTypes = Object.keys(componentMap);
        allComponentTypes.forEach(type => {
            if(type !== 'label') counts[type] = 0;
        });
        counts['wire'] = 0;


        elements.forEach(el => {
            if (counts[el.type] !== undefined) {
                counts[el.type]++;
            }
        });

        counts['wire'] = wires.length;

        return Object.entries(counts)
            .filter(([, count]) => count > 0)
            .map(([name, count]) => ({
                item: name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                quantity: count,
            }));

    }, [elements, wires]);


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

        if (activeTool === 'select' || draggingElement) {
             setWiringStartElement(null); // Deselect wiring start if clicking on canvas background
            return;
        }
        
        if (activeTool === 'wire') {
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
    
    const getElementById = (id: number) => {
      const elData = elements.find(el => el.id === id);
      if (!elData) return null;
      
      const component = componentMap[elData.type];
      if (!component) return elData;

      return {
          ...elData,
          transform: component.transform,
      };
    };
    
    const handleExport = async (format: 'pdf' | 'jpeg' | 'png') => {
        if (!canvasRef.current) return;

        // Temporarily remove background grid for capture
        const originalBg = canvasRef.current.style.backgroundImage;
        canvasRef.current.style.backgroundImage = 'none';

        const canvas = await html2canvas(canvasRef.current, {
            backgroundColor: null, // Use transparent background
            logging: false,
            useCORS: true,
        });

        // Restore background grid
        canvasRef.current.style.backgroundImage = originalBg;

        const dataUrl = canvas.toDataURL(`image/${format}`, 1.0);

        if (format === 'pdf') {
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(dataUrl, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('wattpad-canvas.pdf');
        } else {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `wattpad-canvas.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Blueprint Board</h1>
        <div className="flex gap-2 items-center">
            <div className="flex items-center space-x-2">
                <Switch id="show-takeoff" checked={showTakeoff} onCheckedChange={setShowTakeoff} />
                <Label htmlFor="show-takeoff">Show Take-off</Label>
            </div>
            <Button variant="outline" onClick={clearCanvas}>
                <Trash2 className="mr-2 h-4 w-4"/>
                Clear
            </Button>
            <Button variant="outline" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4"/>
                Save
            </Button>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Printer className="mr-2 h-4 w-4" />
                  Print / Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => handleExport('pdf')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleExport('jpeg')}>
                    <FileImage className="mr-2 h-4 w-4" />
                    Export as JPG
                </DropdownMenuItem>
                 <DropdownMenuItem onSelect={() => handleExport('png')}>
                    <FileImage className="mr-2 h-4 w-4" />
                    Export as PNG
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 flex gap-4 flex-col md:flex-row">
        <Card className="w-full md:w-auto">
            <CardContent className="p-2 flex md:flex-col gap-1 justify-center flex-wrap">
                 {tools.map(tool => {
                    const isToolActive = activeTool === tool.id || (tool.subTools && tool.subTools.some(st => st.id === activeTool));
                    if (tool.subTools) {
                        return (
                             <DropdownMenu key={tool.id}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant={isToolActive ? "secondary" : "ghost"}
                                        size="icon"
                                        className="w-16 h-16 flex-col"
                                        title={tool.label}
                                    >
                                        <tool.icon className="size-8" style={{ transform: tool.transform }} />
                                        <span className="text-xs">{tool.label}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {tool.subTools.map(subTool => (
                                        <DropdownMenuItem key={subTool.id} onSelect={() => setActiveTool(subTool.id)}>
                                            <subTool.icon className="mr-2 size-5" style={{ transform: subTool.transform }} />
                                            <span>{subTool.label}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    }
                    return (
                        <Button 
                            key={tool.id}
                            variant={activeTool === tool.id ? "secondary" : "ghost"}
                            size="icon"
                            className="w-16 h-16 flex-col"
                            onClick={() => {
                                setActiveTool(tool.id);
                                setWiringStartElement(null);
                            }}
                            title={tool.label}
                        >
                            <tool.icon className="size-8" style={{ transform: tool.transform }} />
                            <span className="text-xs">{tool.label}</span>
                        </Button>
                    )
                 })}
            </CardContent>
        </Card>
        <div className="flex-1 flex flex-col gap-4">
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
                        const Icon = componentIconMap[el.type];
                        const componentDetails = componentMap[el.type];
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
                                        style={{ transform: componentDetails?.transform }} 
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
            {showTakeoff && takeoffList.length > 0 && (
                 <Collapsible defaultOpen={true}>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" className="w-full">
                            Take-off List
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <Card className="mt-2">
                            <CardContent className="p-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead className="text-right">Quantity</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {takeoffList.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{item.item}</TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </CollapsibleContent>
                 </Collapsible>
            )}
        </div>
      </div>
    </div>
  );
}
