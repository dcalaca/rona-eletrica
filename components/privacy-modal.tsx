'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PrivacyModalProps {
  children: React.ReactNode
  onAccept?: () => void
}

export function PrivacyModal({ children, onAccept }: PrivacyModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Política de Privacidade</DialogTitle>
          <DialogDescription>
            Leia nossa política de privacidade para entender como seus dados são utilizados.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="prose prose-sm max-w-none">
            <h2>1. Informações que Coletamos</h2>
            <p>
              Coletamos informações que você nos fornece diretamente, como:
            </p>
            <ul>
              <li>Nome completo e dados de contato</li>
              <li>Endereço de entrega e cobrança</li>
              <li>Informações de pagamento</li>
              <li>Histórico de compras</li>
              <li>Comunicações conosco</li>
            </ul>

            <h2>2. Como Usamos suas Informações</h2>
            <p>
              Utilizamos suas informações para:
            </p>
            <ul>
              <li>Processar e entregar seus pedidos</li>
              <li>Comunicar sobre seu pedido</li>
              <li>Melhorar nossos produtos e serviços</li>
              <li>Enviar ofertas e promoções (com seu consentimento)</li>
              <li>Cumprir obrigações legais</li>
            </ul>

            <h2>3. Compartilhamento de Informações</h2>
            <p>
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
              exceto quando necessário para:
            </p>
            <ul>
              <li>Processar pagamentos</li>
              <li>Entregar produtos</li>
              <li>Cumprir obrigações legais</li>
              <li>Proteger nossos direitos</li>
            </ul>

            <h2>4. Segurança dos Dados</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger 
              suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>

            <h2>5. Cookies e Tecnologias Similares</h2>
            <p>
              Utilizamos cookies para melhorar sua experiência de navegação, 
              lembrar suas preferências e analisar o tráfego do site.
            </p>

            <h2>6. Seus Direitos</h2>
            <p>
              Você tem o direito de:
            </p>
            <ul>
              <li>Acessar suas informações pessoais</li>
              <li>Corrigir dados incorretos</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Retirar seu consentimento</li>
              <li>Portabilidade dos dados</li>
            </ul>

            <h2>7. Retenção de Dados</h2>
            <p>
              Mantemos suas informações pessoais apenas pelo tempo necessário para 
              cumprir os propósitos descritos nesta política ou conforme exigido por lei.
            </p>

            <h2>8. Menores de Idade</h2>
            <p>
              Nossos serviços não são direcionados a menores de 18 anos. 
              Não coletamos intencionalmente informações de menores.
            </p>

            <h2>9. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta política periodicamente. 
              Notificaremos sobre mudanças significativas por email ou através do site.
            </p>

            <h2>10. Contato</h2>
            <p>
              Para questões sobre privacidade, entre em contato conosco:
              <br />
              <strong>Rona Elétrica e Hidráulica Ltda</strong>
              <br />
              CNPJ: 26.244.711/0001-03
              <br />
              Telefone: (14) 99145-4789
              <br />
              Email: privacidade@ronaeletrica.com.br
            </p>

            <p className="text-sm text-muted-foreground mt-8">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
          <Button onClick={() => {
            onAccept?.()
            setOpen(false)
          }}>
            Aceitar Política
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
