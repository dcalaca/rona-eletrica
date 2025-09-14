"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CartSidebar } from "@/components/cart-sidebar"
import { Search, User, Menu, X, Phone, MapPin } from "lucide-react"
import { useSession } from "next-auth/react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top bar with contact info */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>(14) 99145-4789</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Atendimento: Seg-Sex 07h30-17h30 | Sáb 07h30-12h00</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Instalação, reparos e caminhão muque para postes</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <span className="font-bold text-xl">RE</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">Rona Elétrica</h1>
              <p className="text-sm text-muted-foreground">& Hidráulica</p>
            </div>
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input type="search" placeholder="Buscar produtos..." className="pl-10 pr-4" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <CartSidebar />

            {/* User account */}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/minha-conta">
                <User className="h-5 w-5" />
                <span className="hidden md:inline ml-2">
                  {status === "loading" ? "Carregando..." : 
                   session?.user?.name ? `Olá, ${session.user.name.split(' ')[0]}` : 
                   "Minha Conta"}
                </span>
              </Link>
            </Button>

            {/* Mobile menu toggle */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Input type="search" placeholder="Buscar produtos..." className="pl-10 pr-4" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Navigation */}
        <nav className={`${isMenuOpen ? "block" : "hidden"} md:block mt-4`}>
          <ul className="flex flex-col md:flex-row md:justify-center space-y-2 md:space-y-0 md:space-x-8">
            <li>
              <Link href="/" className="text-foreground hover:text-primary font-medium">
                Início
              </Link>
            </li>
            <li>
              <Link href="/produtos" className="text-foreground hover:text-primary font-medium">
                Produtos
              </Link>
            </li>
            <li>
              <Link href="/categorias" className="text-foreground hover:text-primary font-medium">
                Categorias
              </Link>
            </li>
            <li>
              <Link href="/ofertas" className="text-foreground hover:text-primary font-medium">
                Ofertas
              </Link>
            </li>
            <li>
              <Link href="/sobre" className="text-foreground hover:text-primary font-medium">
                Sobre Nós
              </Link>
            </li>
            <li>
              <Link href="/contato" className="text-foreground hover:text-primary font-medium">
                Contato
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
