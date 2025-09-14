import { DeliveryManagement } from "@/components/delivery-management"

export default function AdminDeliveriesPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Entregas</h1>
        <p className="text-muted-foreground">Acompanhe e gerencie entregas e logística</p>
      </div>
      <DeliveryManagement />
    </>
  )
}
