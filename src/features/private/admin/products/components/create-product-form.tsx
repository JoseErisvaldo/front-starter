import { useState, type FormEvent } from 'react'
import { Alert, Button, Stack, TextField } from '@mui/material'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import { CurrencyInput, parseCurrencyInput } from '../../../../../shared/components/currency-input'
import { useCreateProductMutation } from '../mutations/use-create-product-mutation'
import { createProductInputSchema } from '../schema/create-product.schema'

type Props = {
  onCreated: () => void
}

export function CreateProductForm({ onCreated }: Props) {
  const createProduct = useCreateProductMutation()
  const [formError, setFormError] = useState('')
  const [price, setPrice] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const formData = new FormData(event.currentTarget)
    const result = createProductInputSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseCurrencyInput(price),
    })

    if (!result.success) {
      setFormError(result.error.issues[0]?.message ?? 'Confira os dados informados.')
      return
    }

    createProduct.mutate(result.data, {
      onSuccess: onCreated,
      onError: (error) => setFormError(getApiErrorMessage(error)),
    })
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
      <TextField
        name="name"
        label="Nome do produto"
        autoComplete="off"
        required
        fullWidth
        slotProps={{ htmlInput: { maxLength: 120 } }}
      />
      <TextField
        name="description"
        label="Descrição"
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
      <Alert severity="info">O produto será cadastrado como ativo e disponível para venda.</Alert>
      {formError && <Alert severity="error" role="alert">{formError}</Alert>}
      <Button type="submit" variant="contained" disabled={createProduct.isPending}>
        {createProduct.isPending ? 'Cadastrando...' : 'Cadastrar produto'}
      </Button>
    </Stack>
  )
}
