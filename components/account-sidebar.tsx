"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Package, Heart, MapPin, CreditCard, Bell, LogOut, Settings } from "lucide-react"

const menuItems = [
  { id: "overview", label: "Visão Geral", icon: User, href: "/minha-conta" },
  { id: "orders", label: "Meus Pedidos", icon: Package, href: "/minha-conta/pedidos" },
  { id: "favorites", label: "Favoritos", icon: Heart, href: "/minha-conta/favoritos" },
  { id: "addresses", label: "Endereços", icon: MapPin, href: "/minha-conta/enderecos" },
  { id: "payment", label: "Pagamento", icon: CreditCard, href: "/minha-conta/pagamento" },
  { id: "notifications", label: "Notificações", icon: Bell, href: "/minha-conta/notificacoes" },
  { id: "settings", label: "Configurações", icon: Settings, href: "/minha-conta/configuracoes" },
]

export function AccountSidebar() {
  const [activeItem, setActiveItem] = useState("overview")

  // Mock user data
  const user = {
    name: "João Silva",
    email: "joao.silva@email.com",
    avatar: null,
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* User Info */}
        <div className="flex items-center space-x-3 mb-6 pb-6 border-b">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar || ""} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.name}</p>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
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
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="mt-6 pt-6 border-t">
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4 mr-3" />
            Sair
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
