"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Bell,
} from "lucide-react"
import { useAdminStats } from "@/hooks/use-admin-stats"
import { useNotifications } from "@/hooks/use-notifications"
export function AdminSidebar() {
  const pathname = usePathname()
  const { stats, loading } = useAdminStats()
  const { unreadCount } = useNotifications()

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      badge: null,
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: Bell,
      href: "/admin/notificacoes",
      badge: unreadCount > 0 ? unreadCount.toString() : null,
    },
    {
      id: "products",
      label: "Produtos",
      icon: Package,
      href: "/admin/produtos",
      badge: stats.lowStockProducts > 0 ? stats.lowStockProducts.toString() : null,
    },
    {
      id: "orders",
      label: "Pedidos",
      icon: ShoppingCart,
      href: "/admin/pedidos",
      badge: stats.pendingOrders > 0 ? stats.pendingOrders.toString() : null,
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
      badge: stats.pendingDeliveries > 0 ? stats.pendingDeliveries.toString() : null,
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
      badge: stats.unreadMessages > 0 ? stats.unreadMessages.toString() : null,
    },
    {
      id: "reports",
      label: "Relatórios",
      icon: BarChart3,
      href: "/admin/relatorios",
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

  return (
    <aside className="w-64 bg-background border-r border-border h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.id} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
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
