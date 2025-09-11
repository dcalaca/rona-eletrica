import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface RelatedProductsProps {
  categoryId: string
  currentProductId: number
}

// Mock related products data
const relatedProducts = [
  {
    id: 2,
    name: "Fio Flexível 1,5mm² 100m - Prysmian",
    price: 65.9,
    image: "/fios-e-cabos-el-tricos-organizados.jpg",
    rating: 4.7,
    reviews: 89,
    category: "Fios e Cabos",
  },
  {
    id: 3,
    name: "Fio Flexível 4mm² 100m - Prysmian",
    price: 125.9,
    image: "/fios-e-cabos-el-tricos-organizados.jpg",
    rating: 4.8,
    reviews: 156,
    category: "Fios e Cabos",
  },
  {
    id: 4,
    name: "Cabo Flexível 2,5mm² 100m - Pirelli",
    price: 95.9,
    image: "/fios-e-cabos-el-tricos-organizados.jpg",
    rating: 4.6,
    reviews: 67,
    category: "Fios e Cabos",
  },
  {
    id: 5,
    name: "Fio Rígido 2,5mm² 100m - Condumex",
    price: 78.9,
    image: "/fios-e-cabos-el-tricos-organizados.jpg",
    rating: 4.5,
    reviews: 123,
    category: "Fios e Cabos",
  },
]

export function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  // Filter out current product
  const filteredProducts = relatedProducts.filter((product) => product.id !== currentProductId)

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>

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

                <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Button className="w-full" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Adicionar ao Carrinho
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
