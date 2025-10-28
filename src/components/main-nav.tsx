
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
} from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/dashboard/calculators", icon: Calculator, label: "Calculators" },
  { href: "/dashboard/guides", icon: Wrench, label: "Installation Guides" },
  { href: "/dashboard/reference", icon: BookText, label: "Reference Library" },
  { href: "/dashboard/canvas", icon: PenSquare, label: "Interactive Canvas" },
  { href: "/dashboard/well-controls", icon: Droplet, label: "Well Controls" },
  { href: "/dashboard/fire-alarms", icon: Siren, label: "Fire Alarms" },
  { href: "/dashboard/safety", icon: ShieldCheck, label: "Safety Overview" },
  { href: "/dashboard/inspection", icon: ClipboardCheck, label: "Inspection Tips" },
  { href: "/dashboard/settings", icon: Cog, label: "Settings" },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const isActive = item.exact 
          ? pathname === item.href 
          : pathname.startsWith(item.href);

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
