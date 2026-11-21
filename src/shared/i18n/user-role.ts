export const USER_ROLES = ['USER', 'ADMIN', 'MODERATOR'] as const

export type UserRole = (typeof USER_ROLES)[number]

const userRoleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  MODERATOR: 'Moderador',
  USER: 'Usuário',
}

export function translateUserRole(role: UserRole): string {
  return userRoleLabels[role]
}
