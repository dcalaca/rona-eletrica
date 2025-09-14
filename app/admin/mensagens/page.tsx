import { MessageManagement } from '@/components/message-management'

export default function AdminMessagesPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Mensagens</h1>
        <p className="text-muted-foreground">
          Central de mensagens, suporte ao cliente e comunicação
        </p>
      </div>
      <MessageManagement />
    </>
  )
}
