import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Grid, List } from "lucide-react"

export default function ProductsPage() {
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
              <Input type="search" placeholder="Buscar produtos..." className="pl-10 pr-4" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="flex gap-2">
            <Select defaultValue="relevancia">
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
            <ProductFilters />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
