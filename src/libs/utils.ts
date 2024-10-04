import { Module, Project, Task, Token, User } from '@/types'
import dotenv from 'dotenv'
import { put } from '@vercel/blob'

dotenv.config() // load .env file

const { BLOB_READ_WRITE_TOKEN, STORE_URL, STORE_NAME } = process.env

const read = async (): Promise<{
  [key: string]: any
  projects: Project[]
  tasks: Task[]
  users: User[]
  tokens: Token[]
} | null> => {
  if (!STORE_URL) {
    return null
  }
  const response = await fetch(`${STORE_URL}/${STORE_NAME}`, {
    method: 'GET',
    cache: 'no-cache',
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('DATA!', data)
      return data
    })
    .catch((error) => {
      console.log('ERROR!', error)
      return null
    })
  return response
}

const save = async (data: any): Promise<boolean> => {
  if (!STORE_NAME) {
    return false
  }
  if (!BLOB_READ_WRITE_TOKEN) {
    return false
  }
  const parseData = JSON.stringify(data)
  const blob = await put(STORE_NAME, parseData, {
    access: 'public',
    addRandomSuffix: false,
    token: BLOB_READ_WRITE_TOKEN,
  })
    .then((res) => {
      console.log('SAVED!', res)
      return true
    })
    .catch((error) => {
      console.log('ERROR!', error)
      return false
    })
  return blob
}

export const writeDatabase = async <T>(
  data: T[],
  key: Module | 'tokens' | 'users'
): Promise<boolean> => {
  const dataDB = await read()
  if (!dataDB) {
    return false
  }
  dataDB[key] = data
  return save(dataDB)
}

export const readDatabase = async <T>(
  key: Module | 'tokens' | 'users'
): Promise<T[]> => {
  const dataDB = await read()
  return dataDB?.[key] || []
}

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
