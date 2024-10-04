import { Module } from '@/types'

export const generateLongId = (): string => {
  const timestamp = Date.now().toString() // Ottieni il timestamp corrente come stringa
  const randomNum = Math.floor(Math.random() * 1000000).toString() // Genera un numero casuale a sei cifre come stringa
  const longId = timestamp + randomNum // Combina timestamp e numero casuale
  return longId
}

export const trimToken = (token: string): string => {
  return token.replace('Bearer', '').trim()
}

export const checkObjects = (
  objects: { id: string; name: string }[]
): boolean => {
  for (const obj of objects) {
    // Verifica che le chiavi "id" e "name" siano presenti e non siano vuote
    if (
      !Object.prototype.hasOwnProperty.call(obj, 'id') ||
      !Object.prototype.hasOwnProperty.call(obj, 'name') ||
      !obj.id ||
      !obj.name
    ) {
      return false
    }
  }
  return true // Tutti gli oggetti hanno le chiavi "id" e "name" popolate
}

export const includes = (
  module: Module,
  type: 'StatusTask' | 'PriorityTask' | 'StateProject',
  value?: string
): boolean => {
  if (!value || value === '') {
    return true
  }
  const arrayStatusTask = [
    'BACKLOG',
    'OPEN',
    'IN PROGRESS',
    'DONE',
    'DELETED',
    'ARCHIVED',
    'CLOSED',
    'REOPENED',
    'PENDING',
  ]
  if (module === 'tasks' && type === 'StatusTask') {
    return arrayStatusTask.includes(value)
  }
  const arrayPriorityTask = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
  if (module === 'tasks' && type === 'PriorityTask') {
    return arrayPriorityTask.includes(value)
  }
  const arrayStateProject = ['OPENED', 'IN PROGRESS', 'CLOSED', 'DELETED']
  if (module === 'projects' && type === 'StateProject') {
    return arrayStateProject.includes(value)
  }
  return false
}
