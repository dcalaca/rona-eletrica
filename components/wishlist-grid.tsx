'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Eye, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import { useMyAccount } from "@/components/my-account-provider"
import { toast } from "@/hooks/use-toast"

export function WishlistGrid() {
  const { wishlist, loading, removeFromWishlist } = useMyAccount()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const getProductImage = (product: any) => {
    if (product.images && product.images.length > 0) {
      return product.images.find((img: any) => img.is_primary)?.url || product.images[0]?.url
    }
    return "/placeholder.svg"
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId)
      toast({
        title: "Sucesso",
        description: "Produto removido da lista de desejos",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover produto da lista de desejos",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando lista de desejos...</span>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sua lista de desejos está vazia</h3>
          <p className="text-muted-foreground text-center mb-6">
            Adicione produtos que você gostou para comprar depois
          </p>
          <Button asChild>
            <Link href="/produtos">Ver Produtos</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          {wishlist.length} {wishlist.length === 1 ? 'produto' : 'produtos'} na sua lista de desejos
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={getProductImage(item.product)}
                  alt={item.product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {item.product.compare_price && item.product.compare_price > item.product.price && (
                    <Badge variant="destructive" className="text-xs">
                      Oferta
                    </Badge>
                  )}
                  {item.product.stock_quantity <= 0 && (
                    <Badge variant="secondary" className="text-xs">
                      Esgotado
                    </Badge>
                  )}
                </div>

                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveFromWishlist(item.product_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/produtos/${item.product_id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {item.product.category && (
                    <Badge variant="outline" className="text-xs">
                      {item.product.category.name}
                    </Badge>
                  )}
                  {item.product.brand && (
                    <span className="text-xs text-muted-foreground">{item.product.brand.name}</span>
                  )}
                </div>

                <Link href={`/produtos/${item.product_id}`}>
                  <h3 className="font-medium text-sm leading-tight hover:text-primary transition-colors line-clamp-2">
                    {item.product.name}
                  </h3>
                </Link>

                <div className="space-y-1">
                  {item.product.compare_price && item.product.compare_price > item.product.price && (
                    <p className="text-xs text-muted-foreground line-through">{formatPrice(item.product.compare_price)}</p>
                  )}
                  <p className="text-lg font-bold text-primary">{formatPrice(item.product.price)}</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <div className="flex gap-2 w-full">
                <Button 
                  className="flex-1" 
                  disabled={item.product.stock_quantity <= 0} 
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {item.product.stock_quantity > 0 ? "Adicionar ao Carrinho" : "Indisponível"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveFromWishlist(item.product_id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
