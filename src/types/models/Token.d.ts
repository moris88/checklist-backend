import { StatusToken } from '@/types'

export interface Token extends Record<string, string> {
  token: string
  expiresAt: string
  statusToken: StatusToken
  userID: string
  createdAt: string
}
