import type { State, Lookup } from '@/types'

export interface Project extends Record<string, any> {
  id: string //mandatory
  owner: Lookup //mandatory
  name: string //mandatory
  description: string | null
  createdAt: string
  updatedAt: string
  members: Lookup[] //mandatory
  service: string | null
  subService: string | null
  state: State //mandatory
}
