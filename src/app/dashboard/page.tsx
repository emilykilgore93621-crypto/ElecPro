
import Link from 'next/link';
import {
  ArrowRight,
  Calculator,
  LayoutDashboard,
  Wrench,
  BookText,
  PenSquare,
  ShieldCheck,
  ClipboardCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Calculator,
    title: 'Calculation Tools',
    description: "Ohm's Law, wire sizing, and box fill calculators.",
    href: '/dashboard/calculators',
  },
  {
    icon: Wrench,
    title: 'Installation Guides',
    description: 'Step-by-step guides for common device installations.',
    href: '/dashboard/guides',
  },
  {
    icon: BookText,
    title: 'Reference Library',
    description: 'NEC, PGE, and NFPA docs with AI-powered guidance.',
    href: '/dashboard/reference',
  },
  {
    icon: PenSquare,
    title: 'Interactive Canvas',
    description: 'Simulate wiring setups and circuit designs.',
    href: '/dashboard/canvas',
  },
  {
    icon: ShieldCheck,
    title: 'Safety Overview',
    description: 'Best practices for safe handling of equipment.',
    href: '/dashboard/safety',
  },
  {
    icon: ClipboardCheck,
    title: 'Inspection Tips',
    description: 'Learn what inspectors look for to ensure compliance.',
    href: '/dashboard/inspection',
  },
];

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <feature.icon className="size-6 text-primary" />
                <CardTitle className="font-headline">{feature.title}</CardTitle>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild variant="secondary" className="w-full">
                <Link href={feature.href}>
                  Open Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

    