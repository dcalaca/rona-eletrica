import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AccountSidebar } from "@/components/account-sidebar"
import { SettingsManagement } from "@/components/settings-management"
import { AuthGuard } from "@/components/auth-guard"
import { MyAccountProvider } from "@/components/my-account-provider"

export default function SettingsPage() {
  return (
    <AuthGuard>
      <MyAccountProvider>
        <div className="min-h-screen bg-background">
          <Header />

          <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Configurações</h1>
              <p className="text-muted-foreground">Gerencie suas configurações pessoais e da conta</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <AccountSidebar />
              </div>

              <div className="lg:col-span-3">
                <SettingsManagement />
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </MyAccountProvider>
    </AuthGuard>
  )
}
