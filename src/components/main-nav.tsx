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
} from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/calculators", icon: Calculator, label: "Calculators" },
  { href: "/dashboard/guides", icon: Wrench, label: "Installation Guides" },
  { href: "/dashboard/reference", icon: BookText, label: "Reference Library" },
  { href: "/dashboard/canvas", icon: PenSquare, label: "Interactive Canvas" },
  { href: "/dashboard/safety", icon: ShieldCheck, label: "Safety Overview" },
  { href: "/dashboard/inspection", icon: ClipboardCheck, label: "Inspection Tips" },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
