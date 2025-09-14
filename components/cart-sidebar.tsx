"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, X, Truck, Loader2 } from "lucide-react"
import { useCartContext } from "@/contexts/cart-context"

export function CartSidebar() {
  const {
    items,
    loading,
    error,
    updateQuantity,
    removeFromCart,
    formatPrice,
    getTotalItems,
    getSubtotal,
    getShipping,
    getTotal,
    isCartEmpty
  } = useCartContext()

  const handleUpdateQuantity = async (item_id: string, change: number) => {
    const item = items.find(i => i.id === item_id)
    if (!item) return

    const newQuantity = Math.max(0, item.quantity + change)
    if (newQuantity === 0) {
      await removeFromCart(item_id)
    } else {
      await updateQuantity(item_id, newQuantity)
    }
  }

  const handleRemoveItem = async (item_id: string) => {
    await removeFromCart(item_id)
  }

  const subtotal = getSubtotal()
  const shipping = getShipping()
  const total = getTotal()
  const totalItems = getTotalItems()

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

      <SheetContent className="w-[98vw] max-w-xl sm:w-[600px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho ({totalItems} {totalItems === 1 ? "item" : "itens"})
          </SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center h-full px-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Carregando carrinho...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Erro ao carregar carrinho</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
          </div>
        ) : isCartEmpty() ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Seu carrinho está vazio</h3>
            <p className="text-muted-foreground mb-4">Adicione produtos para começar suas compras</p>
            <Button>Continuar Comprando</Button>
          </div>
        ) : (
          <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
            <ScrollArea className="flex-1 -mx-6 px-8">
              <div className="space-y-4 py-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-lg border bg-card">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded border flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-3">
                      <h4 className="text-sm font-medium leading-tight line-clamp-2 pr-2">{item.name}</h4>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center border rounded">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 text-sm min-w-[2.5rem] text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="text-sm font-medium text-primary">{formatPrice(item.total)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-6 px-8 border-t bg-background">
              {/* Shipping info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4 text-primary" />
                <span className="truncate">
                  {shipping === 0 ? "Frete grátis!" : `Faltam ${formatPrice(200 - subtotal)} para frete grátis`}
                </span>
              </div>

              {/* Order summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span>{shipping === 0 ? "Grátis" : formatPrice(shipping)}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 pt-3">
                <Button className="w-full" size="default">
                  Finalizar Compra
                </Button>
                <Button variant="outline" className="w-full" size="sm">
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
