"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, X, Truck } from "lucide-react"

// Mock cart data
const cartItems = [
  {
    id: 1,
    name: "Fio Flexível 2,5mm² 100m - Prysmian",
    price: 89.9,
    quantity: 2,
    image: "/fios-e-cabos-el-tricos-organizados.jpg",
  },
  {
    id: 2,
    name: "Disjuntor Bipolar 25A - Schneider",
    price: 45.5,
    quantity: 1,
    image: "/disjuntores-el-tricos-em-quadro.jpg",
  },
]

export function CartSidebar() {
  const [items, setItems] = useState(cartItems)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const updateQuantity = (id: number, change: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 200 ? 0 : 15.9
  const total = subtotal + shipping

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho ({totalItems} {totalItems === 1 ? "item" : "itens"})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Seu carrinho está vazio</h3>
            <p className="text-muted-foreground mb-4">Adicione produtos para começar suas compras</p>
            <Button>Continuar Comprando</Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded border"
                    />

                    <div className="flex-1 space-y-2">
                      <h4 className="text-sm font-medium leading-tight line-clamp-2">{item.name}</h4>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-sm font-medium text-primary">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t">
              {/* Shipping info */}
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-primary" />
                <span>
                  {shipping === 0 ? "Frete grátis!" : `Faltam ${formatPrice(200 - subtotal)} para frete grátis`}
                </span>
              </div>

              {/* Order summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frete:</span>
                  <span>{shipping === 0 ? "Grátis" : formatPrice(shipping)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <Button className="w-full" size="lg">
                  Finalizar Compra
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Ver Carrinho Completo
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
