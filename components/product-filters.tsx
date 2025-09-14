"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Loader2 } from "lucide-react"
import { useCategories } from "@/hooks/use-categories"
import { useBrands } from "@/hooks/use-brands"

interface ProductFiltersProps {
  onFiltersChange?: (filters: {
    categories: string[]
    brands: string[]
    priceRange: [number, number]
  }) => void
  categories: string[]
  brands: string[]
  priceRange: [number, number]
}

export function ProductFilters({ 
  onFiltersChange, 
  categories: selectedCategories,
  brands: selectedBrands,
  priceRange
}: ProductFiltersProps) {
  const { categories, loading: categoriesLoading } = useCategories()
  const { brands, loading: brandsLoading } = useBrands()

  const toggleCategory = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId) 
      ? selectedCategories.filter((id) => id !== categoryId) 
      : [...selectedCategories, categoryId]
    
    if (onFiltersChange) {
      onFiltersChange({
        categories: newCategories,
        brands: selectedBrands,
        priceRange: priceRange
      })
    }
  }

  const toggleBrand = (brandId: string) => {
    const newBrands = selectedBrands.includes(brandId) 
      ? selectedBrands.filter((id) => id !== brandId) 
      : [...selectedBrands, brandId]
    
    if (onFiltersChange) {
      onFiltersChange({
        categories: selectedCategories,
        brands: newBrands,
        priceRange: priceRange
      })
    }
  }

  const clearFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({
        categories: [],
        brands: [],
        priceRange: [0, 1000]
      })
    }
  }

  const handlePriceRangeChange = (newRange: number[]) => {
    if (onFiltersChange) {
      onFiltersChange({
        categories: selectedCategories,
        brands: selectedBrands,
        priceRange: newRange as [number, number]
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
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
                const category = categories.find((c) => c.id === categoryId)
                return (
                  <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                    {category?.name}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCategory(categoryId)} />
                  </Badge>
                )
              })}
              {selectedBrands.map((brandId) => {
                const brand = brands.find((b) => b.id === brandId)
                return (
                  <Badge key={brandId} variant="secondary" className="flex items-center gap-1">
                    {brand?.name}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleBrand(brandId)} />
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Faixa de Preço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider 
              value={priceRange} 
              onValueChange={handlePriceRangeChange}
              max={1000} 
              step={10} 
              className="w-full" 
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>R$ {priceRange[0]}</span>
              <span>R$ {priceRange[1]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          {categoriesLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <label
                    htmlFor={category.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Marcas</CardTitle>
        </CardHeader>
        <CardContent>
          {brandsLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand.id}
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={() => toggleBrand(brand.id)}
                  />
                  <label
                    htmlFor={brand.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                  >
                    {brand.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
