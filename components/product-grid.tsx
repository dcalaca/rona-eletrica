"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { useProducts } from "@/hooks/use-products"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCartContext } from "@/contexts/cart-context"
import { useSession } from "next-auth/react"
import { toast } from "@/hooks/use-toast"

interface ProductGridProps {
  categories?: string[]
  brands?: string[]
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  featured?: boolean
  offers?: boolean
}

export function ProductGrid({ 
  categories, 
  brands, 
  search, 
  minPrice, 
  maxPrice, 
  sortBy, 
  sortOrder, 
  featured,
  offers
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: session } = useSession()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToCart } = useCartContext()

  const { products, loading, error, pagination, refetch } = useProducts({
    page: currentPage,
    limit: 12,
    categories,
    brands,
    search,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    featured,
    offers
  })


  const toggleFavorite = async (productId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos aos favoritos",
        variant: "destructive",
      })
      return
    }

    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId)
        toast({
          title: "Sucesso",
          description: "Produto removido da lista de desejos",
        })
      } else {
        await addToWishlist(productId)
        toast({
          title: "Sucesso",
          description: "Produto adicionado à lista de desejos",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar lista de desejos",
        variant: "destructive",
      })
    }
  }

  const handleAddToCart = async (productId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos ao carrinho",
        variant: "destructive",
      })
      return
    }

    try {
      await addToCart(productId, 1)
      toast({
        title: "Sucesso",
        description: "Produto adicionado ao carrinho",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar produto ao carrinho",
        variant: "destructive",
      })
    }
  }

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

  const getAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return sum / reviews.length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando produtos...</span>
      </div>
    )
  }

  if (error) {
    console.error('❌ [ProductGrid] Erro:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Erro ao carregar produtos</p>
        <Button onClick={refetch}>Tentar novamente</Button>
      </div>
    )
  }

  // Se não há produtos e não está carregando, mostrar mensagem de "sem ofertas"
  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <span className="text-4xl">🏷️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhuma oferta disponível no momento</h3>
            <p className="text-muted-foreground mb-6">
              Que pena! Não temos ofertas especiais hoje, mas volte em breve para conferir nossas promoções.
            </p>
          </div>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/produtos">
                Ver todos os produtos
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/categorias">
                Explorar categorias
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Results header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Mostrando {products.length} de {pagination.total} produtos
        </p>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.compare_price && product.compare_price > product.price && (
                    <Badge variant="destructive" className="text-xs">
                      Oferta
                    </Badge>
                  )}
                  {product.stock_quantity <= 0 && (
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
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current text-red-500" : ""}`} />
                  </Button>
                  <Button variant="secondary" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/produtos/${product.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {product.category && (
                    <Badge variant="outline" className="text-xs">
                      {product.category.name}
                    </Badge>
                  )}
                  {product.brand && (
                    <span className="text-xs text-muted-foreground">{product.brand.name}</span>
                  )}
                </div>

                <Link href={`/produtos/${product.id}`}>
                  <h3 className="font-medium text-sm leading-tight hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    <span className="text-xs text-muted-foreground ml-1">
                      {getAverageRating(product.reviews || []).toFixed(1)} ({product.reviews?.length || 0})
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  {product.compare_price && product.compare_price > product.price && (
                    <p className="text-xs text-muted-foreground line-through">{formatPrice(product.compare_price)}</p>
                  )}
                  <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Button 
                className="w-full" 
                disabled={product.stock_quantity <= 0} 
                size="sm"
                onClick={() => handleAddToCart(product.id)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stock_quantity > 0 ? "Adicionar ao Carrinho" : "Indisponível"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Anterior
            </Button>
            
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              )
            })}
            
            <Button 
              variant="outline" 
              disabled={currentPage === pagination.pages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
