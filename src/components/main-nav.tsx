
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calculator,
  LayoutDashboard,
  Wrench,
  BookText,
  PenSquare,
  ShieldCheck,
  ClipboardCheck,
  Cog,
  Droplet,
  Siren,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";


const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/dashboard/calculators", icon: Calculator, label: "Calculators" },
  { href: "/dashboard/guides", icon: Wrench, label: "Installation Guides" },
  { href: "/dashboard/reference", icon: BookText, label: "Reference Library" },
  { href: "/dashboard/canvas", icon: PenSquare, label: "Interactive Canvas", pro: true },
  { href: "/dashboard/well-controls", icon: Droplet, label: "Well Controls" },
  { href: "/dashboard/fire-alarms", icon: Siren, label: "Fire Alarms" },
  { href: "/dashboard/safety", icon: ShieldCheck, label: "Safety Overview" },
  { href: "/dashboard/inspection", icon: ClipboardCheck, label: "Inspection Tips" },
  { href: "/dashboard/settings", icon: Cog, label: "Settings" },
]

export function MainNav({ subscriptionStatus }: { subscriptionStatus: string | null }) {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const isActive = item.exact 
          ? pathname === item.href 
          : pathname.startsWith(item.href);

        const isLocked = item.pro && subscriptionStatus !== 'pro';

        if (isLocked) {
          return (
            <TooltipProvider key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        disabled
                        className="cursor-not-allowed"
                        tooltip="Upgrade to Pro"
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    </SidebarMenuItem>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Upgrade to Pro to access this feature.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  )
}
