"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid, List, ArrowLeft, Package, Loader2 } from "lucide-react"
import { useCategories } from "@/hooks/use-categories"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.id as string
  
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("relevancia")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const { categories, loading: categoriesLoading } = useCategories()
  const currentCategory = categories.find(c => c.id === categoryId)

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Categoria não encontrada</h1>
            <p className="text-muted-foreground mb-6">
              A categoria que você está procurando não existe ou foi removida.
            </p>
            <Button asChild>
              <Link href="/categorias">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Categorias
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Início</Link>
          <span>/</span>
          <Link href="/categorias" className="hover:text-primary">Categorias</Link>
          <span>/</span>
          <span className="text-foreground">{currentCategory.name}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/categorias">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <Badge variant="secondary" className="text-sm">
              {currentCategory.name}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">{currentCategory.name}</h1>
          <p className="text-muted-foreground">
            {currentCategory.description || `Explore os melhores produtos da categoria ${currentCategory.name}`}
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Input 
                type="search" 
                placeholder="Buscar produtos nesta categoria..." 
                className="pl-10 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevancia">Relevância</SelectItem>
                <SelectItem value="menor-preco">Menor Preço</SelectItem>
                <SelectItem value="maior-preco">Maior Preço</SelectItem>
                <SelectItem value="nome-a-z">Nome A-Z</SelectItem>
                <SelectItem value="nome-z-a">Nome Z-A</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button 
                variant={viewMode === "grid" ? "default" : "ghost"} 
                size="sm" 
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "ghost"} 
                size="sm" 
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">
            Produtos em {currentCategory.name}
          </h2>
          <p className="text-muted-foreground">
            Encontre os melhores produtos desta categoria
          </p>
        </div>

        <ProductGrid 
          search={searchTerm}
          categories={[categoryId]}
          sortBy={sortBy === 'relevancia' ? 'created_at' : sortBy === 'menor-preco' ? 'price' : sortBy === 'maior-preco' ? 'price' : 'name'}
          sortOrder={sortBy === 'menor-preco' ? 'asc' : sortBy === 'maior-preco' ? 'desc' : sortBy === 'nome-a-z' ? 'asc' : sortBy === 'nome-z-a' ? 'desc' : 'desc'}
        />
      </main>

      <Footer />
    </div>
  )
}
