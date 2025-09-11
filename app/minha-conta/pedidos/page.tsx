import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AccountSidebar } from "@/components/account-sidebar"
import { OrderHistory } from "@/components/order-history"

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
          <p className="text-muted-foreground">Acompanhe o status dos seus pedidos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>

          <div className="lg:col-span-3">
            <OrderHistory />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
