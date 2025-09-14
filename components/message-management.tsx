'use client'

import { useState } from 'react'
import { useAdminMessages, Message, MessageFilters } from '@/hooks/use-admin-messages'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  MessageSquare, 
  Mail, 
  Clock, 
  CheckCircle, 
  Reply,
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  AlertTriangle,
  User,
  Calendar,
  Tag,
  Star
} from 'lucide-react'

export function MessageManagement() {
  const {
    messages,
    loading,
    error,
    stats,
    pagination,
    fetchMessages,
    updateMessageStatus,
    createReply,
    getMessageDetails,
    markAsRead,
    closeMessage
  } = useAdminMessages()

  const [filters, setFilters] = useState<MessageFilters>({
    search: '',
    status: 'all',
    category: 'all',
    priority: 'all',
    page: 1,
    limit: 10
  })
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isInternalReply, setIsInternalReply] = useState(false)

  // Aplicar filtros
  const handleFilter = () => {
    fetchMessages(filters)
  }

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      category: 'all',
      priority: 'all',
      page: 1,
      limit: 10
    })
    fetchMessages({})
  }

  // Marcar como lida
  const handleMarkAsRead = async (id: string) => {
    const success = await markAsRead(id)
    if (success) {
      setShowDetails(false)
    }
  }

  // Fechar mensagem
  const handleCloseMessage = async (id: string) => {
    const success = await closeMessage(id)
    if (success) {
      setShowDetails(false)
    }
  }

  // Criar resposta
  const handleCreateReply = async () => {
    if (!selectedMessage || !replyContent) return

    const success = await createReply(selectedMessage.id, replyContent, isInternalReply)
    if (success) {
      setShowReply(false)
      setReplyContent('')
      setIsInternalReply(false)
    }
  }

  // Abrir detalhes
  const handleViewDetails = async (message: Message) => {
    const details = await getMessageDetails(message.id)
    if (details) {
      setSelectedMessage(details)
      setShowDetails(true)
    }
  }

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800'
      case 'read': return 'bg-blue-100 text-blue-800'
      case 'replied': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Obter label do status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'unread': return 'Não lida'
      case 'read': return 'Lida'
      case 'replied': return 'Respondida'
      case 'closed': return 'Fechada'
      default: return status
    }
  }

  // Obter cor da prioridade
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Obter label da prioridade
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgente'
      case 'high': return 'Alta'
      case 'medium': return 'Média'
      case 'low': return 'Baixa'
      default: return priority
    }
  }

  // Obter label da categoria
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'support': return 'Suporte'
      case 'general': return 'Geral'
      case 'complaint': return 'Reclamação'
      case 'suggestion': return 'Sugestão'
      default: return category
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Mensagens</p>
                  <p className="text-2xl font-bold">{stats.totalMessages}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Não Lidas</p>
                  <p className="text-2xl font-bold">{stats.unreadMessages}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Reply className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Respondidas</p>
                  <p className="text-2xl font-bold">{stats.repliedMessages}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Urgentes</p>
                  <p className="text-2xl font-bold">{stats.urgentMessages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Assunto, conteúdo..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="unread">Não lidas</SelectItem>
                  <SelectItem value="read">Lidas</SelectItem>
                  <SelectItem value="replied">Respondidas</SelectItem>
                  <SelectItem value="closed">Fechadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="support">Suporte</SelectItem>
                  <SelectItem value="general">Geral</SelectItem>
                  <SelectItem value="complaint">Reclamação</SelectItem>
                  <SelectItem value="suggestion">Sugestão</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={filters.priority}
                onValueChange={(value) => setFilters({ ...filters, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={handleFilter} className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Mensagens */}
      <Card>
        <CardHeader>
          <CardTitle>Mensagens</CardTitle>
          <CardDescription>
            {pagination.total} mensagens encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma mensagem encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Respostas</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{message.subject}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {message.content.substring(0, 50)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{message.user?.name || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">
                            {message.user?.email || 'N/A'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getCategoryLabel(message.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(message.priority)}>
                          {getPriorityLabel(message.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(message.status)}>
                          {getStatusLabel(message.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(message.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Reply className="h-4 w-4 text-muted-foreground" />
                          <span>{message.reply_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Mensagem</DialogTitle>
            <DialogDescription>
              Informações completas sobre a mensagem
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Assunto</Label>
                  <p className="font-medium">{selectedMessage.subject}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedMessage.status)}>
                    {getStatusLabel(selectedMessage.status)}
                  </Badge>
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Badge variant="outline">
                    {getCategoryLabel(selectedMessage.category)}
                  </Badge>
                </div>
                <div>
                  <Label>Prioridade</Label>
                  <Badge className={getPriorityColor(selectedMessage.priority)}>
                    {getPriorityLabel(selectedMessage.priority)}
                  </Badge>
                </div>
                <div>
                  <Label>Data de Criação</Label>
                  <p>{new Date(selectedMessage.created_at).toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <Label>Última Atualização</Label>
                  <p>{new Date(selectedMessage.updated_at).toLocaleString('pt-BR')}</p>
                </div>
              </div>

              {selectedMessage.user && (
                <div>
                  <Label>Cliente</Label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p><strong>Nome:</strong> {selectedMessage.user.name}</p>
                    <p><strong>Email:</strong> {selectedMessage.user.email}</p>
                    <p><strong>Telefone:</strong> {selectedMessage.user.phone}</p>
                  </div>
                </div>
              )}

              <div>
                <Label>Conteúdo da Mensagem</Label>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </div>

              {selectedMessage.notes && (
                <div>
                  <Label>Observações</Label>
                  <p className="bg-gray-50 p-3 rounded-md">{selectedMessage.notes}</p>
                </div>
              )}

              {/* Ações */}
              <div className="space-y-4">
                <div>
                  <Label>Ações</Label>
                  <div className="flex space-x-2">
                    {selectedMessage.status === 'unread' && (
                      <Button onClick={() => handleMarkAsRead(selectedMessage.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar como Lida
                      </Button>
                    )}
                    <Button 
                      onClick={() => setShowReply(true)}
                      variant="outline"
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Responder
                    </Button>
                    {selectedMessage.status !== 'closed' && (
                      <Button 
                        onClick={() => handleCloseMessage(selectedMessage.id)}
                        variant="destructive"
                      >
                        Fechar Mensagem
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Resposta */}
      <Dialog open={showReply} onOpenChange={setShowReply}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responder Mensagem</DialogTitle>
            <DialogDescription>
              Enviar resposta para a mensagem selecionada
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Resposta</Label>
              <Textarea
                placeholder="Digite sua resposta..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={6}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="internal"
                checked={isInternalReply}
                onChange={(e) => setIsInternalReply(e.target.checked)}
              />
              <Label htmlFor="internal">Resposta interna (não será enviada ao cliente)</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowReply(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateReply} disabled={!replyContent}>
                <Reply className="h-4 w-4 mr-2" />
                Enviar Resposta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
