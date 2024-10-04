import dotenv from 'dotenv'
import { Module, Project, Task, Token, User } from '@/types'
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

const save = async (data: string): Promise<boolean> => {
  if (!STORE_NAME) {
    return false
  }
  if (!BLOB_READ_WRITE_TOKEN) {
    return false
  }
  const blob = await put(STORE_NAME, data, {
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
  console.log('DATA WRITE:', dataDB)
  return save(JSON.stringify(dataDB))
}

export const readDatabase = async <T>(
  key: Module | 'tokens' | 'users'
): Promise<T[]> => {
  const dataDB = await read()
  console.log('DATA READ:', dataDB)
  return dataDB?.[key] || []
}
