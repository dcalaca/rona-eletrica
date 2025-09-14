import { CategoryManagement } from "@/components/category-management"

export default function AdminCategoriesPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Categorias</h1>
        <p className="text-muted-foreground">Organize produtos em categorias e subcategorias</p>
      </div>
      <CategoryManagement />
    </>
  )
}
