import { useRef, type ChangeEvent } from 'react'
import { TextField, type TextFieldProps } from '@mui/material'

type Props = Omit<TextFieldProps, 'value' | 'onChange' | 'type' | 'inputRef'> & {
  value: string
  onValueChange: (value: string) => void
}

export function formatCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''

  const cents = BigInt(digits)
  const whole = (cents / 100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const fraction = String(cents % 100n).padStart(2, '0')
  return `${whole},${fraction}`
}

export function parseCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits ? Number(BigInt(digits)) / 100 : undefined
}

function getFormattedCaret(value: string, cursor: number) {
  const digitsBeforeCursor = value.slice(0, cursor).replace(/\D/g, '').length
  const formattedValue = formatCurrencyInput(value)
  const totalDigits = value.replace(/\D/g, '').length
  if (digitsBeforeCursor === totalDigits) {
    return { formattedValue, caret: formattedValue.length }
  }
  if (digitsBeforeCursor === 0) return { formattedValue, caret: 0 }

  let digitsSeen = 0
  for (let index = 0; index < formattedValue.length; index += 1) {
    if (/\d/.test(formattedValue[index])) digitsSeen += 1
    if (digitsSeen === digitsBeforeCursor) {
      return { formattedValue, caret: index + 1 }
    }
  }

  return { formattedValue, caret: formattedValue.length }
}

export function CurrencyInput({ value, onValueChange, slotProps, ...props }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const inputValue = event.target.value
    const cursor = event.target.selectionStart ?? inputValue.length
    const formatted = getFormattedCaret(inputValue, cursor)

    onValueChange(formatted.formattedValue)
    window.requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(formatted.caret, formatted.caret)
    })
  }

  return (
    <TextField
      {...props}
      inputRef={inputRef}
      type="text"
      value={value}
      onChange={handleChange}
      slotProps={{
        ...slotProps,
        htmlInput: {
          ...slotProps?.htmlInput,
          inputMode: 'decimal',
        },
      }}
    />
  )
}
