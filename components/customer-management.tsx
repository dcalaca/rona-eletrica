"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingCart,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock customers data
const customers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    company: "Silva Construções",
    segment: "Construção Civil",
    city: "São Paulo",
    state: "SP",
    totalOrders: 12,
    totalRevenue: 4567.8,
    lastOrder: "2024-01-15",
    status: "Ativo",
    priority: "Alta",
    notes: "Cliente fiel, sempre compra materiais elétricos em grande quantidade.",
    avatar: null,
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(11) 88888-8888",
    company: "Santos Elétrica",
    segment: "Elétrica",
    city: "São Paulo",
    state: "SP",
    totalOrders: 8,
    totalRevenue: 2890.5,
    lastOrder: "2024-01-14",
    status: "Ativo",
    priority: "Média",
    notes: "Especializada em instalações residenciais.",
    avatar: null,
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    email: "carlos.oliveira@email.com",
    phone: "(11) 77777-7777",
    company: "Oliveira Hidráulica",
    segment: "Hidráulica",
    city: "Guarulhos",
    state: "SP",
    totalOrders: 15,
    totalRevenue: 6234.2,
    lastOrder: "2024-01-13",
    status: "Ativo",
    priority: "Alta",
    notes: "Maior cliente do segmento hidráulico.",
    avatar: null,
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(11) 66666-6666",
    company: "Costa Reformas",
    segment: "Reformas",
    city: "Osasco",
    state: "SP",
    totalOrders: 5,
    totalRevenue: 1456.7,
    lastOrder: "2024-01-10",
    status: "Inativo",
    priority: "Baixa",
    notes: "Cliente sazonal, compra apenas durante reformas.",
    avatar: null,
  },
]

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [segmentFilter, setSegmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800"
      case "Média":
        return "bg-yellow-100 text-yellow-800"
      case "Baixa":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800"
      case "Inativo":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSegment = segmentFilter === "all" || customer.segment === segmentFilter
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesSegment && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Segmento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os segmentos</SelectItem>
              <SelectItem value="Construção Civil">Construção Civil</SelectItem>
              <SelectItem value="Elétrica">Elétrica</SelectItem>
              <SelectItem value="Hidráulica">Hidráulica</SelectItem>
              <SelectItem value="Reformas">Reformas</SelectItem>
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
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              <DialogDescription>Cadastre um novo cliente em sua carteira</DialogDescription>
            </DialogHeader>
            <AddCustomerForm onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={customer.avatar || ""} alt={customer.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <CardDescription>{customer.company}</CardDescription>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Phone className="h-4 w-4 mr-2" />
                      Ligar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Reunião
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{customer.segment}</Badge>
                <Badge className={getPriorityColor(customer.priority)}>{customer.priority}</Badge>
                <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span>
                    {customer.city}, {customer.state}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <ShoppingCart className="h-3 w-3" />
                    <span>Pedidos</span>
                  </div>
                  <p className="font-semibold">{customer.totalOrders}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <span>Total</span>
                  </div>
                  <p className="font-semibold">{formatPrice(customer.totalRevenue)}</p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Último pedido: {new Date(customer.lastOrder).toLocaleDateString("pt-BR")}
              </div>

              {customer.notes && (
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                  <strong>Observações:</strong> {customer.notes}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  WhatsApp
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Phone className="h-3 w-3 mr-1" />
                  Ligar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AddCustomerForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    segment: "",
    city: "",
    state: "",
    priority: "Média",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement customer creation
    console.log("Creating customer:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: João Silva"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Empresa</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
            placeholder="Ex: Silva Construções"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="joao@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="(11) 99999-9999"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="segment">Segmento</Label>
          <Select
            value={formData.segment}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, segment: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Construção Civil">Construção Civil</SelectItem>
              <SelectItem value="Elétrica">Elétrica</SelectItem>
              <SelectItem value="Hidráulica">Hidráulica</SelectItem>
              <SelectItem value="Reformas">Reformas</SelectItem>
              <SelectItem value="Manutenção">Manutenção</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
            placeholder="São Paulo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
            placeholder="SP"
            maxLength={2}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Prioridade</Label>
        <Select
          value={formData.priority}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Alta">Alta</SelectItem>
            <SelectItem value="Média">Média</SelectItem>
            <SelectItem value="Baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Informações adicionais sobre o cliente..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Cadastrar Cliente</Button>
      </div>
    </form>
  )
}
