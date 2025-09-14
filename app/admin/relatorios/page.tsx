import { ReportsManagement } from '@/components/reports-management'

export default function AdminReportsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">
          Análises detalhadas, gráficos e exportação de dados
        </p>
      </div>
      <ReportsManagement />
    </>
  )
}
