"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Eye } from "lucide-react"
import Link from "next/link"

// Mock product data
const products = [
  {
    id: 1,
    name: "Fio Flexível 2,5mm² 100m - Prysmian",
    price: 89.9,
    originalPrice: 99.9,
    image: "/fios-e-cabos-el-tricos-organizados.jpg",
    rating: 4.8,
    reviews: 156,
    category: "Fios e Cabos",
    brand: "Prysmian",
    inStock: true,
    isPromotion: true,
  },
  {
    id: 2,
    name: "Disjuntor Bipolar 25A - Schneider",
    price: 45.5,
    image: "/disjuntores-el-tricos-em-quadro.jpg",
    rating: 4.9,
    reviews: 89,
    category: "Disjuntores",
    brand: "Schneider",
    inStock: true,
    isPromotion: false,
  },
  {
    id: 3,
    name: "Tubo PVC 32mm 6m - Tigre",
    price: 12.9,
    image: "/tubos-e-conex-es-hidr-ulicas.jpg",
    rating: 4.7,
    reviews: 234,
    category: "Tubos e Conexões",
    brand: "Tigre",
    inStock: true,
    isPromotion: false,
  },
  {
    id: 4,
    name: "Furadeira de Impacto 650W - Bosch",
    price: 189.9,
    originalPrice: 229.9,
    image: "/ferramentas-el-tricas-profissionais.jpg",
    rating: 4.6,
    reviews: 67,
    category: "Ferramentas",
    brand: "Bosch",
    inStock: true,
    isPromotion: true,
  },
  {
    id: 5,
    name: "Lâmpada LED 12W Branco Frio - Philips",
    price: 8.9,
    image: "/l-mpadas-led-e-lumin-rias-modernas.jpg",
    rating: 4.5,
    reviews: 123,
    category: "Iluminação",
    brand: "Philips",
    inStock: true,
    isPromotion: false,
  },
  {
    id: 6,
    name: "Bomba Centrífuga 1/2CV - WEG",
    price: 299.9,
    image: "/bombas-d--gua-e-pressurizadores.jpg",
    rating: 4.8,
    reviews: 45,
    category: "Bombas",
    brand: "WEG",
    inStock: false,
    isPromotion: false,
  },
]

export function ProductGrid() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <div>
      {/* Results header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">Mostrando {products.length} de 714 produtos</p>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isPromotion && (
                    <Badge variant="destructive" className="text-xs">
                      Oferta
                    </Badge>
                  )}
                  {!product.inStock && (
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
                    <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? "fill-current text-red-500" : ""}`} />
                  </Button>
                  <Button variant="secondary" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{product.brand}</span>
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
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  {product.originalPrice && (
                    <p className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
                  )}
                  <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Button className="w-full" disabled={!product.inStock} size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inStock ? "Adicionar ao Carrinho" : "Indisponível"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Anterior
          </Button>
          <Button variant="default">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">...</Button>
          <Button variant="outline">12</Button>
          <Button variant="outline">Próximo</Button>
        </div>
      </div>
    </div>
  )
}
