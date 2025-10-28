
"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser, useFirestore } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Lock, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { guideData } from "./guide-data";
import { useToast } from "@/hooks/use-toast";


const guideCategories = [
    {
        name: "Fixtures",
        guides: [
            { slug: "cameras", title: "Cameras" },
            { slug: "ceiling-fan", title: "Ceiling Fan" },
            { slug: "lighting-fixtures", title: "Lighting Fixtures" },
            { slug: "outlets", title: "Outlets" },
            { slug: "gfci", title: "GFCI Outlets" },
            { slug: "switches", title: "Switches" },
            { slug: "smart-switch", title: "Smart Switch" },
            { slug: "usb-outlet", title: "USB Outlet" },
        ]
    },
    {
        name: "Appliances",
        guides: [
            { slug: "dishwasher", title: "Dishwasher" },
            { slug: "garbage-disposal", title: "Garbage Disposal" },
            { slug: "hot-water-heater", title: "Hot Water Heater" },
            { slug: "ranges-and-hoods", title: "Ranges and Hoods" },
        ]
    },
    {
        name: "HVAC & Alarms",
        guides: [
            { slug: "cooler-motor", title: "Cooler Motor" },
            { slug: "fire-alarms", title: "Fire Alarms" },
        ]
    },
    {
        name: "Specialty Systems",
        guides: [
            { slug: "rv-wiring", title: "RV / Trailer Wiring" },
            { slug: "well-pump", title: "Water Well Pump" },
        ]
    },
    {
        name: "Service & Distribution",
        guides: [
            { slug: "circuit-breakers", title: "Circuit Breaker Safety" },
            { slug: "generator-transfer-switch", title: "Generator Transfer Switch" },
            { slug: "weather-tight", title: "Weather-tight Outlets" },
        ]
    },
];

export default function GuidesPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (user && firestore) {
            const userDocRef = doc(firestore, "users", user.uid);
            getDoc(userDocRef).then((docSnap) => {
                if (docSnap.exists()) {
                    setSubscriptionStatus(docSnap.data().subscriptionStatus);
                }
            });
        }
    }, [user, firestore, subscriptionStatus]);

    const handleUpgrade = async () => {
        if (!user || !firestore) return;
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, { subscriptionStatus: 'pro' }, { merge: true });
        setSubscriptionStatus('pro');
        toast({
            title: 'Upgrade Successful!',
            description: 'You now have access to all Pro features.',
        });
    };

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Installation & Safety Guides</h1>
            </div>
            <div className="space-y-8">
                {guideCategories.map((category) => (
                    <div key={category.name}>
                        <h2 className="text-2xl font-headline mb-4">{category.name}</h2>
                        <Separator className="mb-6" />
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {category.guides.sort((a,b) => a.title.localeCompare(b.title)).map((guide) => {
                                const guideDetails = guideData[guide.slug];
                                const isLocked = guideDetails?.pro && subscriptionStatus !== 'pro';
                                
                                const cardContent = (
                                     <Card className={cn("overflow-hidden transition-all h-full flex flex-col", isLocked ? "bg-muted/50 cursor-not-allowed" : "hover:shadow-lg hover:-translate-y-1")}>
                                        <CardHeader className="flex-1 relative">
                                            {isLocked && (
                                                <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1">
                                                    <Lock className="size-3"/>
                                                </div>
                                            )}
                                            <CardTitle className="font-headline text-lg">{guide.title}</CardTitle>
                                        </CardHeader>
                                    </Card>
                                );

                                if (isLocked) {
                                    return <div key={guide.slug}>{cardContent}</div>;
                                }

                                return (
                                    <Link key={guide.slug} href={`/dashboard/guides/${guide.slug}`}>
                                        {cardContent}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
                 {subscriptionStatus === 'free' && (
                    <Card className="mt-8">
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-2 font-headline text-2xl"><Crown className="text-primary size-8"/> Unlock All Guides</CardTitle>
                            <CardContent className="text-muted-foreground pt-4 flex flex-col items-center gap-4">
                                <p>Upgrade to Pro to get instant access to all premium guides, the interactive canvas, and more.</p>
                                <Button size="lg" onClick={handleUpgrade}>Upgrade to Pro</Button>
                                <p className="text-xs">Are you a student or educator? Contact us for a discount.</p>
                            </CardContent>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </>
    );
}

    