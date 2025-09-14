"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid, List, ArrowRight, Package } from "lucide-react"
import { useCategories } from "@/hooks/use-categories"
import Link from "next/link"

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("relevancia")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const { categories, loading: categoriesLoading } = useCategories()

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const clearCategoryFilter = () => {
    setSelectedCategory(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Categorias</h1>
          <p className="text-muted-foreground">
            Explore nossos produtos organizados por categoria
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Input 
                type="search" 
                placeholder="Buscar produtos..." 
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Categorias
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === null ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={clearCategoryFilter}
                    >
                      Todas as Categorias
                    </Button>
                    {categories.map((category) => (
                      <div key={category.id} className="flex gap-2">
                        <Button
                          variant={selectedCategory === category.id ? "default" : "ghost"}
                          className="flex-1 justify-between"
                          onClick={() => handleCategorySelect(category.id)}
                        >
                          <span>{category.name}</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/categorias/${category.id}`}>
                            Ver
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Filter */}
            {selectedCategory && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Filtro Ativo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {categories.find(c => c.id === selectedCategory)?.name}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearCategoryFilter}
                    >
                      Limpar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {selectedCategory ? (
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">
                  Produtos em {categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-muted-foreground">
                  Encontre os melhores produtos desta categoria
                </p>
              </div>
            ) : (
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">
                  Todos os Produtos
                </h2>
                <p className="text-muted-foreground">
                  Explore nossa seleção completa de produtos
                </p>
              </div>
            )}

            <ProductGrid 
              search={searchTerm}
              categories={selectedCategory ? [selectedCategory] : []}
              sortBy={sortBy === 'relevancia' ? 'created_at' : sortBy === 'menor-preco' ? 'price' : sortBy === 'maior-preco' ? 'price' : 'name'}
              sortOrder={sortBy === 'menor-preco' ? 'asc' : sortBy === 'maior-preco' ? 'desc' : sortBy === 'nome-a-z' ? 'asc' : sortBy === 'nome-z-a' ? 'desc' : 'desc'}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
