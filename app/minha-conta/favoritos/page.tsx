import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AccountSidebar } from "@/components/account-sidebar"
import { WishlistGrid } from "@/components/wishlist-grid"
import { MyAccountProvider } from "@/components/my-account-provider"
import { AuthGuard } from "@/components/auth-guard"

export default function WishlistPage() {
  return (
    <AuthGuard>
      <MyAccountProvider>
        <div className="min-h-screen bg-background">
          <Header />

          <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Lista de Desejos</h1>
              <p className="text-muted-foreground">Seus produtos favoritos para comprar depois</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <AccountSidebar />
              </div>

              <div className="lg:col-span-3">
                <WishlistGrid />
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </MyAccountProvider>
    </AuthGuard>
  )
}
