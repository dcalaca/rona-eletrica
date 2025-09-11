"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Star, ShoppingCart, Heart, Share2, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviews: number
  category: string
  brand: string
  inStock: boolean
  stockQuantity: number
  sku: string
  description: string
  specifications: Record<string, string>
  features: string[]
}

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stockQuantity) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-lg border">
          <img
            src={product.images[selectedImage] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square overflow-hidden rounded border-2 transition-colors ${
                selectedImage === index ? "border-primary" : "border-border"
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${product.name} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{product.category}</Badge>
            <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
          </div>

          <h1 className="text-3xl font-bold text-balance mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"}`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {product.rating} ({product.reviews} avaliações)
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {product.originalPrice && (
              <p className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
            )}
            <p className="text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
            <p className="text-sm text-muted-foreground">ou 12x de {formatPrice(product.price / 12)} sem juros</p>
          </div>

          <p className="text-muted-foreground mb-6">{product.description}</p>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          {product.inStock ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">Em estoque ({product.stockQuantity} unidades)</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-red-600">Fora de estoque</span>
            </>
          )}
        </div>

        {/* Quantity and Add to Cart */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Quantidade:</label>
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="sm" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="w-16 text-center border-0 focus-visible:ring-0"
                min="1"
                max={product.stockQuantity}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stockQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" size="lg" disabled={!product.inStock}>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Adicionar ao Carrinho
            </Button>

            <Button variant="outline" size="lg" onClick={() => setIsFavorite(!isFavorite)}>
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current text-red-500" : ""}`} />
            </Button>

            <Button variant="outline" size="lg">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Button variant="outline" className="w-full bg-transparent" size="lg">
            Comprar Agora
          </Button>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-primary" />
            <span>Frete grátis acima de R$ 200</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span>Garantia de 5 anos</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <RotateCcw className="h-4 w-4 text-primary" />
            <span>Troca em 30 dias</span>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="specifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="specifications">Especificações</TabsTrigger>
            <TabsTrigger value="features">Características</TabsTrigger>
          </TabsList>

          <TabsContent value="specifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Especificações Técnicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Características</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
