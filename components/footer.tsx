import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <span className="font-bold text-lg">RE</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Rona Elétrica</h3>
                <p className="text-sm text-muted-foreground">& Hidráulica</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Rona Elétrica e Hidráulica Ltda - CNPJ: 26.244.711/0001-03<br/>
              Fundada em 27/09/2016, especializada em materiais elétricos e hidráulicos, 
              instalação, reparos e caminhão muque para instalação de postes.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/produtos" className="text-muted-foreground hover:text-primary">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-muted-foreground hover:text-primary">
                  Categorias
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-muted-foreground hover:text-primary">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-muted-foreground hover:text-primary">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-muted-foreground hover:text-primary">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">(14) 99145-4789</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">contato@ronaeletrica.com.br</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <span className="text-muted-foreground">
                  Rona Elétrica e Hidráulica Ltda
                  <br />
                  CNPJ: 26.244.711/0001-03
                  <br />
                  Fundada em: 27/09/2016
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  Seg-Sex: 07h30 às 17h30
                  <br />
                  Sáb: 07h30 às 12h00
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-muted-foreground mb-4">Receba ofertas exclusivas e novidades em primeira mão.</p>
            <div className="space-y-2">
              <Input type="email" placeholder="Seu e-mail" className="w-full" />
              <Button className="w-full">Inscrever-se</Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Rona Elétrica e Hidráulica Ltda - CNPJ: 26.244.711/0001-03. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacidade" className="text-muted-foreground hover:text-primary text-sm">
              Política de Privacidade
            </Link>
            <Link href="/termos" className="text-muted-foreground hover:text-primary text-sm">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
