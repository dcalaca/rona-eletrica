import { AdminLoginForm } from '@/components/admin-login-form'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl font-bold">RE</span>
          </div>
          <h1 className="text-2xl font-bold">Rona Elétrica</h1>
          <p className="text-muted-foreground">Painel Administrativo</p>
        </div>
        
        <AdminLoginForm />
      </div>
    </div>
  )
}
