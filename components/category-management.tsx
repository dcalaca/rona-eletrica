"use client"

import { useState } from "react"
import { useAdminCategories } from "@/hooks/use-admin-categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Package, 
  TrendingUp, 
  Folder, 
  Calendar,
  Star,
  MoreHorizontal,
  Filter,
  Image,
  Tag,
  ArrowUpDown,
  Trash2,
  Copy
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function CategoryManagement() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [parentFilter, setParentFilter] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const { 
    categories, 
    loading, 
    error, 
    updateCategoryStatus, 
    updateCategoryOrder,
    getCategoryDetails,
    createCategory,
    updateCategory,
    deleteCategory
  } = useAdminCategories({
    search: search || undefined,
    status: statusFilter as 'active' | 'inactive' | 'all',
    parentId: parentFilter === 'all' ? undefined : parentFilter === 'root' ? 'root' : parentFilter
  })

  const handleViewDetails = async (categoryId: string) => {
    try {
      const details = await getCategoryDetails(categoryId)
      setSelectedCategory(details)
      setIsDetailsDialogOpen(true)
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error)
    }
  }

  const handleToggleStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      await updateCategoryStatus(categoryId, !currentStatus)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleUpdateOrder = async (categoryId: string, newOrder: number) => {
    try {
      await updateCategoryOrder(categoryId, newOrder)
    } catch (error) {
      console.error('Erro ao atualizar ordem:', error)
    }
  }

  const handleCreateCategory = async (formData: any) => {
    try {
      await createCategory(formData)
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
    }
  }

  const handleUpdateCategory = async (categoryId: string, formData: any) => {
    try {
      await updateCategory(categoryId, formData)
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId)
    } catch (error) {
      console.error('Erro ao deletar categoria:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="h-64 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>Erro ao carregar categorias: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Categorias</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <Folder className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categorias Ativas</p>
                <p className="text-2xl font-bold">
                  {categories.filter(c => c.is_active).length}
                </p>
              </div>
              <Tag className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Produtos</p>
                <p className="text-2xl font-bold">
                  {categories.reduce((sum, c) => sum + c.stats.totalProducts, 0)}
                </p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subcategorias</p>
                <p className="text-2xl font-bold">
                  {categories.reduce((sum, c) => sum + c.stats.totalSubcategories, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Categorias</CardTitle>
              <CardDescription>Organize produtos em categorias e subcategorias</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Categoria</DialogTitle>
                  <DialogDescription>
                    Crie uma nova categoria para organizar produtos
                  </DialogDescription>
                </DialogHeader>
                <CreateCategoryForm onSubmit={handleCreateCategory} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar categorias..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="inactive">Inativas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={parentFilter} onValueChange={setParentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="root">Categorias Principais</SelectItem>
                <SelectItem value="sub">Subcategorias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela de Categorias */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Pai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Subcategorias</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="0"
                        value={category.sort_order}
                        onChange={(e) => {
                          const newOrder = parseInt(e.target.value)
                          if (!isNaN(newOrder)) {
                            handleUpdateOrder(category.id, newOrder)
                          }
                        }}
                        className="w-20"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {category.icon && (
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                          <span className="text-sm">{category.icon}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">{category.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {category.parent ? (
                      <Badge variant="outline">{category.parent.name}</Badge>
                    ) : (
                      <span className="text-muted-foreground">Principal</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.is_active ? "default" : "secondary"}>
                      {category.is_active ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{category.stats.totalProducts}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.stats.activeProducts} ativos
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{category.stats.totalSubcategories}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.stats.activeSubcategories} ativas
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(category.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category)
                          setIsDetailsDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={category.is_active}
                        onCheckedChange={() => handleToggleStatus(category.id, category.is_active)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {categories.length === 0 && (
            <div className="text-center py-8">
              <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma categoria encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Categoria</DialogTitle>
            <DialogDescription>
              Informações completas e produtos da categoria
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && <CategoryDetails category={selectedCategory} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente de Formulário de Criação
function CreateCategoryForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    parent_id: "",
    image_url: "",
    icon: "",
    is_active: true,
    sort_order: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="parent_id">Categoria Pai</Label>
          <Input
            id="parent_id"
            value={formData.parent_id}
            onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
            placeholder="Deixe vazio para categoria principal"
          />
        </div>
        <div>
          <Label htmlFor="sort_order">Ordem</Label>
          <Input
            id="sort_order"
            type="number"
            min="0"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="image_url">URL da Imagem</Label>
          <Input
            id="image_url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="icon">Ícone</Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="Ex: 📦"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Categoria ativa</Label>
      </div>
      <Button type="submit" className="w-full">
        Criar Categoria
      </Button>
    </form>
  )
}

// Componente de Detalhes da Categoria
function CategoryDetails({ category }: { category: any }) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="products">Produtos</TabsTrigger>
        <TabsTrigger value="subcategories">Subcategorias</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações da Categoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Nome:</strong> {category.name}</p>
              <p><strong>Slug:</strong> {category.slug}</p>
              <p><strong>Descrição:</strong> {category.description || "Não informado"}</p>
              <p><strong>Status:</strong> 
                <Badge variant={category.is_active ? "default" : "secondary"} className="ml-2">
                  {category.is_active ? "Ativa" : "Inativa"}
                </Badge>
              </p>
              <p><strong>Ordem:</strong> {category.sort_order}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Total de Produtos:</strong> {category.stats.totalProducts}</p>
              <p><strong>Produtos Ativos:</strong> {category.stats.activeProducts}</p>
              <p><strong>Estoque Baixo:</strong> {category.stats.lowStockProducts}</p>
              <p><strong>Subcategorias:</strong> {category.stats.totalSubcategories}</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="products" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Produtos da Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {category.products?.slice(0, 10).map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell>
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="subcategories" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Subcategorias</CardTitle>
          </CardHeader>
          <CardContent>
            {category.children && category.children.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {category.children.map((subcategory: any) => (
                  <div key={subcategory.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{subcategory.name}</p>
                        <p className="text-sm text-muted-foreground">{subcategory.slug}</p>
                      </div>
                      <Badge variant={subcategory.is_active ? "default" : "secondary"}>
                        {subcategory.is_active ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma subcategoria encontrada</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
