"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Search, Edit, Trash2, Eye, AlertTriangle, CheckCircle, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock products data
const products = [
  {
    id: 1,
    name: "Fio Flexível 2,5mm² 100m - Prysmian",
    sku: "PRY-FLX-25-100",
    category: "Fios e Cabos",
    brand: "Prysmian",
    price: 89.9,
    cost: 65.0,
    stock: 25,
    minStock: 20,
    status: "Ativo",
    image: "/fios-e-cabos-el-tricos-organizados.jpg",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    name: "Disjuntor Bipolar 25A - Schneider",
    sku: "SCH-DIS-25A",
    category: "Disjuntores",
    brand: "Schneider",
    price: 45.5,
    cost: 32.0,
    stock: 8,
    minStock: 15,
    status: "Ativo",
    image: "/disjuntores-el-tricos-em-quadro.jpg",
    createdAt: "2024-01-08",
  },
  {
    id: 3,
    name: "Tubo PVC 32mm 6m - Tigre",
    sku: "TIG-PVC-32-6M",
    category: "Tubos e Conexões",
    brand: "Tigre",
    price: 12.9,
    cost: 8.5,
    stock: 150,
    minStock: 25,
    status: "Ativo",
    image: "/tubos-e-conex-es-hidr-ulicas.jpg",
    createdAt: "2024-01-05",
  },
  {
    id: 4,
    name: "Lâmpada LED 12W Branco Frio - Philips",
    sku: "PHI-LED-12W-BF",
    category: "Iluminação",
    brand: "Philips",
    price: 8.9,
    cost: 5.2,
    stock: 0,
    minStock: 30,
    status: "Inativo",
    image: "/l-mpadas-led-e-lumin-rias-modernas.jpg",
    createdAt: "2024-01-03",
  },
]

export function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: "Sem estoque", color: "bg-red-100 text-red-800", icon: AlertTriangle }
    if (stock <= minStock)
      return { label: "Estoque baixo", color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle }
    return { label: "Em estoque", color: "bg-green-100 text-green-800", icon: CheckCircle }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="Fios e Cabos">Fios e Cabos</SelectItem>
              <SelectItem value="Disjuntores">Disjuntores</SelectItem>
              <SelectItem value="Tubos e Conexões">Tubos e Conexões</SelectItem>
              <SelectItem value="Iluminação">Iluminação</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
              <DialogDescription>Preencha as informações do produto</DialogDescription>
            </DialogHeader>
            <AddProductForm onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos ({filteredProducts.length})</CardTitle>
          <CardDescription>Gerencie seu catálogo de produtos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock, product.minStock)
              const StockIcon = stockStatus.icon

              return (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded border"
                    />

                    <div className="space-y-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>SKU: {product.sku}</span>
                        <span>•</span>
                        <Badge variant="outline">{product.category}</Badge>
                        <span>•</span>
                        <span>{product.brand}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="font-medium">{formatPrice(product.price)}</span>
                        <Badge className={stockStatus.color}>
                          <StockIcon className="h-3 w-3 mr-1" />
                          {stockStatus.label} ({product.stock})
                        </Badge>
                        <Badge variant={product.status === "Ativo" ? "default" : "secondary"}>{product.status}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Duplicar</DropdownMenuItem>
                        <DropdownMenuItem>Exportar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AddProductForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    brand: "",
    price: "",
    cost: "",
    stock: "",
    minStock: "",
    description: "",
    isActive: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement product creation
    console.log("Creating product:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: Fio Flexível 2,5mm²"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
            placeholder="Ex: PRY-FLX-25-100"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fios e Cabos">Fios e Cabos</SelectItem>
              <SelectItem value="Disjuntores">Disjuntores</SelectItem>
              <SelectItem value="Tubos e Conexões">Tubos e Conexões</SelectItem>
              <SelectItem value="Iluminação">Iluminação</SelectItem>
              <SelectItem value="Ferramentas">Ferramentas</SelectItem>
              <SelectItem value="Bombas">Bombas d'Água</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
            placeholder="Ex: Prysmian"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Preço de Venda (R$)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
            placeholder="0,00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">Preço de Custo (R$)</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData((prev) => ({ ...prev, cost: e.target.value }))}
            placeholder="0,00"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Estoque Atual</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
            placeholder="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minStock">Estoque Mínimo</Label>
          <Input
            id="minStock"
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData((prev) => ({ ...prev, minStock: e.target.value }))}
            placeholder="0"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Descrição detalhada do produto..."
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="isActive">Produto ativo</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Criar Produto</Button>
      </div>
    </form>
  )
}
