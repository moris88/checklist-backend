import type { Role } from '@/types'

export interface User extends Record<string, string> {
  id: string
  username: string
  hash: string
  salt: string
  role: Role
  createdAt: string
  updatedAt: string
}
