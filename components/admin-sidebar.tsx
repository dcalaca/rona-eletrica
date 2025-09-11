"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  FileText,
  UserCheck,
  MessageSquare,
  Truck,
  CreditCard,
  Tag,
} from "lucide-react"

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    badge: null,
  },
  {
    id: "products",
    label: "Produtos",
    icon: Package,
    href: "/admin/produtos",
    badge: null,
  },
  {
    id: "orders",
    label: "Pedidos",
    icon: ShoppingCart,
    href: "/admin/pedidos",
    badge: "12",
  },
  {
    id: "customers",
    label: "Clientes",
    icon: Users,
    href: "/admin/clientes",
    badge: null,
  },
  {
    id: "vendors",
    label: "Vendedores",
    icon: UserCheck,
    href: "/admin/vendedores",
    badge: null,
  },
  {
    id: "categories",
    label: "Categorias",
    icon: Tag,
    href: "/admin/categorias",
    badge: null,
  },
  {
    id: "shipping",
    label: "Entregas",
    icon: Truck,
    href: "/admin/entregas",
    badge: "5",
  },
  {
    id: "payments",
    label: "Pagamentos",
    icon: CreditCard,
    href: "/admin/pagamentos",
    badge: null,
  },
  {
    id: "messages",
    label: "Mensagens",
    icon: MessageSquare,
    href: "/admin/mensagens",
    badge: "3",
  },
  {
    id: "reports",
    label: "Relatórios",
    icon: BarChart3,
    href: "/admin/relatorios",
    badge: null,
  },
  {
    id: "content",
    label: "Conteúdo",
    icon: FileText,
    href: "/admin/conteudo",
    badge: null,
  },
  {
    id: "settings",
    label: "Configurações",
    icon: Settings,
    href: "/admin/configuracoes",
    badge: null,
  },
]

export function AdminSidebar() {
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
