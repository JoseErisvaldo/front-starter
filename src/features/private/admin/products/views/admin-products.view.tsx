import { LayoutAdmin } from '../../../../../shared/layout/layout-admin'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import { CreateProductForm } from '../components/create-product-form'
import { EditProductForm } from '../components/edit-product-form'
import { AdminProductsTable } from '../components/admin-products-table'
import { useAdminProductsPage } from '../hooks/use-admin-products-page'

export function AdminProductsView() {
  const page = useAdminProductsPage()
  const logout = useLogout()

  return (
    <LayoutAdmin
      title="Produtos"
      subtitle="Cadastre e acompanhe os produtos disponíveis para venda."
      onLogout={logout}
      actions={[
        {
          id: 'create-product',
          label: 'Criar produto',
          title: 'Cadastrar produto',
          subtitle: 'Informe os dados do produto que será oferecido para venda.',
          content: ({ close }) => <CreateProductForm onCreated={close} />,
        },
        {
          id: 'edit-product',
          title: 'Editar produto',
          subtitle: page.editingProduct?.name,
          content: ({ close }) => page.editingProduct
            ? <EditProductForm
                key={page.editingProduct.id}
                product={page.editingProduct}
                onUpdated={close}
              />
            : null,
        },
      ]}
    >
      {({ openAction }) => (
        <AdminProductsTable
          products={page.products}
          isLoading={page.isLoading}
          isFetching={page.isFetching}
          error={page.error}
          actionError={page.actionError}
          rowCount={page.rowCount}
          paginationModel={page.paginationModel}
          onPaginationModelChange={page.setPaginationModel}
          sortModel={page.sortModel}
          onSortModelChange={page.changeSort}
          pendingProductId={page.pendingProductId}
          onEditProduct={(product) => {
            page.setEditingProduct(product)
            openAction('edit-product')
          }}
          onToggleActive={page.toggleActive}
        />
      )}
    </LayoutAdmin>
  )
}
