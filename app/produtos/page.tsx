"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Grid, List } from "lucide-react"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("relevancia")
  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    priceRange: [0, 1000] as [number, number]
  })

  // Ler parâmetro de categoria da URL
  useEffect(() => {
    const categoriaParam = searchParams.get('categoria')
    if (categoriaParam) {
      setFilters(prev => ({
        ...prev,
        categories: [categoriaParam]
      }))
    }
  }, [searchParams])

  const handleFiltersChange = (newFilters: {
    categories: string[]
    brands: string[]
    priceRange: [number, number]
  }) => {
    // Verificar se os filtros realmente mudaram para evitar re-renders desnecessários
    const categoriesChanged = JSON.stringify(filters.categories) !== JSON.stringify(newFilters.categories)
    const brandsChanged = JSON.stringify(filters.brands) !== JSON.stringify(newFilters.brands)
    const priceRangeChanged = JSON.stringify(filters.priceRange) !== JSON.stringify(newFilters.priceRange)
    
    if (categoriesChanged || brandsChanged || priceRangeChanged) {
      setFilters(newFilters)
    }
  }
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Produtos</h1>
          <p className="text-muted-foreground">
            Encontre os melhores materiais elétricos e hidráulicos para seu projeto
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

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>

            <div className="hidden md:flex border rounded-md">
              <Button variant="ghost" size="sm" className="rounded-r-none">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-l-none">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <ProductFilters 
              onFiltersChange={handleFiltersChange}
              categories={filters.categories}
              brands={filters.brands}
              priceRange={filters.priceRange}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid 
              search={searchTerm}
              categories={filters.categories}
              brands={filters.brands}
              minPrice={filters.priceRange[0]}
              maxPrice={filters.priceRange[1]}
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
