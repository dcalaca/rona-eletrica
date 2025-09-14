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
import { Search, Grid, List, Percent, Clock, Star, Filter } from "lucide-react"
import { useCategories } from "@/hooks/use-categories"
import { useBrands } from "@/hooks/use-brands"

export default function OffersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("maior-desconto")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const { categories, loading: categoriesLoading } = useCategories()
  const { brands, loading: brandsLoading } = useBrands()

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([0, 1000])
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Percent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Ofertas Especiais</h1>
              <p className="text-muted-foreground">
                Aproveite nossas melhores promoções e descontos
              </p>
            </div>
          </div>
          
          {/* Promotional Banner */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary rounded-full">
                    <Clock className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Ofertas por tempo limitado!</h3>
                    <p className="text-muted-foreground">
                      Produtos com até 50% de desconto. Não perca!
                    </p>
                  </div>
                </div>
                <Badge variant="destructive" className="text-sm px-3 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Até 50% OFF
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Input 
                type="search" 
                placeholder="Buscar ofertas..." 
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
                <SelectItem value="maior-desconto">Maior Desconto</SelectItem>
                <SelectItem value="menor-preco">Menor Preço</SelectItem>
                <SelectItem value="maior-preco">Maior Preço</SelectItem>
                <SelectItem value="nome-a-z">Nome A-Z</SelectItem>
                <SelectItem value="nome-z-a">Nome Z-A</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>

            <div className="hidden md:flex border rounded-md">
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
          {/* Sidebar Filters */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="space-y-6">
              {/* Active Filters */}
              {hasActiveFilters && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Filtros Ativos</CardTitle>
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Limpar Tudo
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((categoryId) => {
                        const category = categories.find(c => c.id === categoryId)
                        return (
                          <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                            {category?.name}
                            <button 
                              onClick={() => toggleCategory(categoryId)}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        )
                      })}
                      {selectedBrands.map((brandId) => {
                        const brand = brands.find(b => b.id === brandId)
                        return (
                          <Badge key={brandId} variant="secondary" className="flex items-center gap-1">
                            {brand?.name}
                            <button 
                              onClick={() => toggleBrand(brandId)}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Categories Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Categorias</CardTitle>
                </CardHeader>
                <CardContent>
                  {categoriesLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-8 bg-muted animate-pulse rounded" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Brands Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Marcas</CardTitle>
                </CardHeader>
                <CardContent>
                  {brandsLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-8 bg-muted animate-pulse rounded" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <label key={brand.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand.id)}
                            onChange={() => toggleBrand(brand.id)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{brand.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Price Range Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Faixa de Preço</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>R$ {priceRange[0]}</span>
                      <span>R$ {priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">
                Produtos em Oferta
              </h2>
              <p className="text-muted-foreground">
                Encontre as melhores promoções e descontos
              </p>
            </div>

            <ProductGrid 
              search={searchTerm}
              categories={selectedCategories}
              brands={selectedBrands}
              minPrice={priceRange[0]}
              maxPrice={priceRange[1]}
              sortBy={sortBy === 'maior-desconto' ? 'discount_percentage' : sortBy === 'menor-preco' ? 'price' : sortBy === 'maior-preco' ? 'price' : 'name'}
              sortOrder={sortBy === 'menor-preco' ? 'asc' : sortBy === 'maior-preco' ? 'desc' : sortBy === 'nome-a-z' ? 'asc' : sortBy === 'nome-z-a' ? 'desc' : 'desc'}
              offers={true} // Apenas produtos em oferta
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
