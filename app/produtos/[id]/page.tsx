import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetails } from "@/components/product-details"
import { RelatedProducts } from "@/components/related-products"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Mock product data - in real app this would come from database
const getProduct = (id: string) => {
  const products = {
    "1": {
      id: 1,
      name: "Fio Flexível 2,5mm² 100m - Prysmian",
      price: 89.9,
      originalPrice: 99.9,
      images: [
        "/fios-e-cabos-el-tricos-organizados.jpg",
        "/fios-e-cabos-el-tricos-organizados.jpg",
        "/fios-e-cabos-el-tricos-organizados.jpg",
      ],
      rating: 4.8,
      reviews: 156,
      category: "Fios e Cabos",
      brand: "Prysmian",
      inStock: true,
      stockQuantity: 25,
      sku: "PRY-FLX-25-100",
      description:
        "Fio flexível de cobre nu, têmpera mole, isolação em PVC 70°C, antichama BWF-B, para 450/750V. Ideal para instalações elétricas residenciais e comerciais.",
      specifications: {
        Seção: "2,5mm²",
        Comprimento: "100 metros",
        Material: "Cobre nu",
        Isolação: "PVC 70°C",
        Tensão: "450/750V",
        Cor: "Azul",
        Norma: "NBR NM 247-3",
      },
      features: [
        "Condutor de cobre nu têmpera mole",
        "Isolação em PVC antichama",
        "Flexibilidade para instalações",
        "Certificado pelo INMETRO",
        "Garantia de 5 anos",
      ],
    },
  }

  return products[id as keyof typeof products] || null
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id)

  if (!product) {
    return <div>Produto não encontrado</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Início</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/produtos">Produtos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/categorias/${product.category.toLowerCase().replace(" ", "-")}`}>
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <ProductDetails product={product} />

        <div className="mt-16">
          <RelatedProducts categoryId={product.category} currentProductId={product.id} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
