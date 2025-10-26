import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

const safetyTopics = [
    { slug: "circuit-breakers", title: "Circuit Breaker Safety" },
    { slug: "safe-wiring", title: "Safe Wiring Practices" },
    { slug: "power-tools", title: "Power Tool Handling" },
    { slug: "ppe", title: "Personal Protective Equipment" },
]

export default function SafetyPage() {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Safety Overview</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {safetyTopics.map((topic) => {
                    return (
                        <Link key={topic.slug} href={`/dashboard/guides/${topic.slug}`}>
                             <Card className="flex flex-col justify-center items-center text-center p-6 transition-all hover:shadow-lg hover:-translate-y-1 h-full">
                                <ShieldCheck className="h-12 w-12 mb-4 text-primary" />
                                <CardHeader>
                                    <CardTitle className="font-headline">{topic.title}</CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </>
    );
}
