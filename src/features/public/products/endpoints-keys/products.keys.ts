export const productsQueryKeys = {
  all: ['products'] as const,
  lists: () => [...productsQueryKeys.all, 'list'] as const,
}
