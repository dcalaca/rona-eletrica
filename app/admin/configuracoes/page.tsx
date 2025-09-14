import { SettingsManagement } from '@/components/settings-management'

export default function AdminSettingsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações gerais do sistema e da loja
        </p>
      </div>
      <SettingsManagement />
    </>
  )
}
