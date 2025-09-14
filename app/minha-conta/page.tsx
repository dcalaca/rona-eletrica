import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AccountSidebar } from "@/components/account-sidebar"
import { AccountOverview } from "@/components/account-overview"
import { MyAccountProvider } from "@/components/my-account-provider"
import { AuthGuard } from "@/components/auth-guard"

export default function MyAccountPage() {
  return (
    <AuthGuard>
      <MyAccountProvider>
        <div className="min-h-screen bg-background">
          <Header />

          <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Minha Conta</h1>
              <p className="text-muted-foreground">Gerencie suas informações pessoais e pedidos</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <AccountSidebar />
              </div>

              <div className="lg:col-span-3">
                <AccountOverview />
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </MyAccountProvider>
    </AuthGuard>
  )
}
