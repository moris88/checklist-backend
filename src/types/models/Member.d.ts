import { Lookup } from '@/types'

export interface Member extends Record<string, any> {
  id: string //mandatory
  owner: Lookup //mandatory
  first_name: string
  last_name: string
  full_name: string
  email: string //mandatory
  role: string
}
