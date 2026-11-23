import { useState, type FormEvent } from 'react'
import { Alert, Button, Stack, TextField } from '@mui/material'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import { CurrencyInput, formatCurrencyInput, parseCurrencyInput } from '../../../../../shared/components/currency-input'
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
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(formatCurrencyInput(product.price.toFixed(2)))

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const result = createProductInputSchema.safeParse({
      name,
      description,
      price: parseCurrencyInput(price),
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
        value={name}
        onChange={(event) => setName(event.target.value)}
        autoComplete="off"
        required
        fullWidth
        slotProps={{ htmlInput: { maxLength: 120 } }}
      />
      <TextField
        name="description"
        label="Descrição"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        multiline
        minRows={4}
        required
        fullWidth
        slotProps={{ htmlInput: { maxLength: 2000 } }}
      />
      <CurrencyInput
        name="price"
        label="Preço (R$)"
        value={price}
        onValueChange={setPrice}
        required
        fullWidth
      />
      {formError && <Alert severity="error" role="alert">{formError}</Alert>}
      <Button type="submit" variant="contained" disabled={updateProduct.isPending}>
        {updateProduct.isPending ? 'Salvando...' : 'Salvar alterações'}
      </Button>
    </Stack>
  )
}
