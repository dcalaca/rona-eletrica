"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Target,
  DollarSign,
  MessageSquare,
  Calendar,
  FileText,
  TrendingUp,
  Phone,
} from "lucide-react"

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/vendedor",
    badge: null,
  },
  {
    id: "customers",
    label: "Meus Clientes",
    icon: Users,
    href: "/vendedor/clientes",
    badge: "45",
  },
  {
    id: "orders",
    label: "Pedidos",
    icon: ShoppingCart,
    href: "/vendedor/pedidos",
    badge: "8",
  },
  {
    id: "goals",
    label: "Metas",
    icon: Target,
    href: "/vendedor/metas",
    badge: null,
  },
  {
    id: "commissions",
    label: "Comissões",
    icon: DollarSign,
    href: "/vendedor/comissoes",
    badge: null,
  },
  {
    id: "leads",
    label: "Leads",
    icon: Phone,
    href: "/vendedor/leads",
    badge: "12",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageSquare,
    href: "/vendedor/whatsapp",
    badge: "3",
  },
  {
    id: "schedule",
    label: "Agenda",
    icon: Calendar,
    href: "/vendedor/agenda",
    badge: null,
  },
  {
    id: "reports",
    label: "Relatórios",
    icon: TrendingUp,
    href: "/vendedor/relatorios",
    badge: null,
  },
  {
    id: "proposals",
    label: "Propostas",
    icon: FileText,
    href: "/vendedor/propostas",
    badge: "5",
  },
]

export function VendorSidebar() {
  const [activeItem, setActiveItem] = useState("dashboard")

  return (
    <aside className="w-64 bg-background border-r border-border h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id

          return (
            <Link key={item.id} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveItem(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
