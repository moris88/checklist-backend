import { Status, Priority, Lookup } from '@/types'

export interface Task extends Record<string, any> {
  id: string //mandatory
  owner: Lookup //mandatory
  title: string //mandatory
  description: string | null
  status: Status //mandatory
  createdAt: string
  updatedAt: string
  priority: Priority //mandatory
  deadline: string | null
  project: Lookup
  assignee: Lookup[] | null
  type: string | null
}
