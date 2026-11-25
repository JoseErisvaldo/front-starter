import type { BarLabelProps } from '@mui/x-charts/BarChart'

export function MultilineBarLabel({ children, x, y, width, ...props }: BarLabelProps) {
  const lines = String(children ?? '').split('|')
  const labelX = x + width / 2
  const firstLineY = y - 32

  return (
    <text
      {...props}
      x={labelX}
      y={firstLineY}
      textAnchor="middle"
      dominantBaseline="hanging"
      fill="#000000"
      fontSize={9}
      fontWeight={700}
    >
      {lines.map((line, index) => (
        <tspan key={`${line}-${index}`} x={labelX} y={firstLineY + index * 10}>
          {line}
        </tspan>
      ))}
    </text>
  )
}
