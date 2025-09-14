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
import { Plus, Search, Edit, Trash2, Eye, AlertTriangle, CheckCircle, MoreHorizontal, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAdminProducts } from "@/hooks/use-admin-products"
import { useCategories } from "@/hooks/use-categories"
import { useBrands } from "@/hooks/use-brands"
import { toast } from "@/hooks/use-toast"

export function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useAdminProducts({
    search: searchTerm || undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined
  })

  const { categories } = useCategories()
  const { brands } = useBrands()

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

  const handleCreateProduct = async (productData: any) => {
    try {
      await createProduct(productData)
      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso!",
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar produto. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProduct = async (productData: any) => {
    try {
      await updateProduct(editingProduct.id, productData)
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso!",
      })
      setIsEditDialogOpen(false)
      setEditingProduct(null)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId)
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir produto. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (product: any) => {
    setEditingProduct(product)
    setIsEditDialogOpen(true)
  }

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
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
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
            <AddProductForm 
              onSubmit={handleCreateProduct}
              onClose={() => setIsAddDialogOpen(false)} 
              categories={categories}
              brands={brands}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
              <DialogDescription>Atualize as informações do produto</DialogDescription>
            </DialogHeader>
            <EditProductForm 
              product={editingProduct}
              onSubmit={handleUpdateProduct}
              onClose={() => {
                setIsEditDialogOpen(false)
                setEditingProduct(null)
              }} 
              categories={categories}
              brands={brands}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos ({products.length})</CardTitle>
          <CardDescription>Gerencie seu catálogo de produtos</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando produtos...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Erro ao carregar produtos: {error}</p>
              <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => {
                const stockStatus = getStockStatus(product.stock_quantity, product.min_stock)
                const StockIcon = stockStatus.icon

                return (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.images?.[0]?.url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded border"
                      />

                      <div className="space-y-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>SKU: {product.sku}</span>
                          <span>•</span>
                          <Badge variant="outline">{product.category?.name}</Badge>
                          <span>•</span>
                          <span>{product.brand?.name}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="font-medium">{formatPrice(product.price)}</span>
                          <Badge className={stockStatus.color}>
                            <StockIcon className="h-3 w-3 mr-1" />
                            {stockStatus.label} ({product.stock_quantity})
                          </Badge>
                          <Badge variant={product.is_active ? "default" : "secondary"}>
                            {product.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditClick(product)}
                      >
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
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function AddProductForm({ 
  onClose, 
  onSubmit, 
  categories, 
  brands 
}: { 
  onClose: () => void
  onSubmit: (data: any) => void
  categories: any[]
  brands: any[]
}) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category_id: "",
    brand_id: "",
    price: "",
    cost: "",
    stock_quantity: "",
    min_stock: "",
    description: "",
    is_active: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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
            value={formData.category_id}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          <Select
            value={formData.brand_id}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, brand_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a marca" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            value={formData.stock_quantity}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock_quantity: e.target.value }))}
            placeholder="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minStock">Estoque Mínimo</Label>
          <Input
            id="minStock"
            type="number"
            value={formData.min_stock}
            onChange={(e) => setFormData((prev) => ({ ...prev, min_stock: e.target.value }))}
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
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
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

function EditProductForm({ 
  product, 
  onClose, 
  onSubmit, 
  categories, 
  brands 
}: { 
  product: any
  onClose: () => void
  onSubmit: (data: any) => void
  categories: any[]
  brands: any[]
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    category_id: product?.category_id || "",
    brand_id: product?.brand_id || "",
    price: product?.price?.toString() || "",
    cost: product?.cost?.toString() || "",
    stock_quantity: product?.stock_quantity?.toString() || "",
    min_stock: product?.min_stock?.toString() || "",
    description: product?.description || "",
    is_active: product?.is_active ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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
            value={formData.category_id}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          <Select
            value={formData.brand_id}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, brand_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a marca" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            value={formData.stock_quantity}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock_quantity: e.target.value }))}
            placeholder="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minStock">Estoque Mínimo</Label>
          <Input
            id="minStock"
            type="number"
            value={formData.min_stock}
            onChange={(e) => setFormData((prev) => ({ ...prev, min_stock: e.target.value }))}
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
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="isActive">Produto ativo</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Atualizar Produto</Button>
      </div>
    </form>
  )
}
