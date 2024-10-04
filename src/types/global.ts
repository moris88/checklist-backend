import type { User, Task, Project, Member } from '@/types/models'

export type Role = 'ADMIN' | 'USER' | 'GUEST' | 'INACTIVE'
export type State = 'OPENED' | 'IN PROGRESS' | 'CLOSED' | 'DELETED'
export type StatusToken = 'ACTIVE' | 'INACTIVE'
export type Status =
  | 'BACKLOG'
  | 'OPEN'
  | 'IN PROGRESS'
  | 'DONE'
  | 'DELETED'
  | 'ARCHIVED'
  | 'CLOSED'
  | 'REOPENED'
  | 'PENDING'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export interface Lookup {
  id: string
  name: string
}

export interface ResponseServer {
  projects?: Project[]
  tasks?: Task[]
  members?: Member[]
  error?: string
  warning?: string
  message?: string
  statusText: 'SUCCESS' | 'ERROR' | 'WARNING'
  status: 200 | 202 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 500 | 501
  count?: number
  id?: string
  profiles?: User[]
  owner?: { id: string; name: string }
  token?: string
}

export type Module = 'projects' | 'tasks' | 'members'
export interface Search {
  module: Module
  field: string
  search: string
  where:
    | 'equal'
    | 'contain'
    | 'start'
    | 'end'
    | 'greater'
    | 'less'
    | 'greaterEqual'
    | 'lessEqual'
}
