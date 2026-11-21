import { useState, type FormEvent } from 'react'
import { Alert, Button, Stack, TextField } from '@mui/material'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import type { AdminProduct } from '../schema/admin-products.schema'
import { createProductInputSchema } from '../schema/create-product.schema'
import { useUpdateProductMutation } from '../mutations/use-update-product-mutation'

type Props = {
  product: AdminProduct
  onUpdated: () => void
}

export function EditProductForm({ product, onUpdated }: Props) {
  const updateProduct = useUpdateProductMutation()
  const [formError, setFormError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const formData = new FormData(event.currentTarget)
    const result = createProductInputSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
    })

    if (!result.success) {
      setFormError(result.error.issues[0]?.message ?? 'Confira os dados informados.')
      return
    }

    updateProduct.mutate(
      { productId: product.id, ...result.data },
      {
        onSuccess: onUpdated,
        onError: (error) => setFormError(getApiErrorMessage(error)),
      },
    )
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
      <TextField
        name="name"
        label="Nome do produto"
        defaultValue={product.name}
        autoComplete="off"
        required
        fullWidth
        slotProps={{ htmlInput: { maxLength: 120 } }}
      />
      <TextField
        name="description"
        label="Descrição"
        defaultValue={product.description}
        multiline
        minRows={4}
        required
        fullWidth
        slotProps={{ htmlInput: { maxLength: 2000 } }}
      />
      <TextField
        name="price"
        label="Preço (R$)"
        type="number"
        defaultValue={product.price}
        required
        fullWidth
        slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
      />
      {formError && <Alert severity="error" role="alert">{formError}</Alert>}
      <Button type="submit" variant="contained" disabled={updateProduct.isPending}>
        {updateProduct.isPending ? 'Salvando...' : 'Salvar alterações'}
      </Button>
    </Stack>
  )
}
