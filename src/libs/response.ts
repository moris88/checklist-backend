import { Member, Project, ResponseServer, Task, User } from '@/types'
import { Response } from 'express'

/*
  HTTPS Status Code:
  200: OK
  201: CREATED
  202: ACCEPTED
  204: NO CONTENT
  400: BAD REQUEST
  401: UNAUTHORIZED
  403: FORBIDDEN
  404: NOT FOUND
  409: CONFLICT
  500: INTERNAL SERVER ERROR
  501: NOT IMPLEMENTED
*/
export const formatResponseError = ({
  message,
  res,
}: {
  res: Response
  message?:
    | 'Not implemented'
    | 'Internal server error'
    | 'Unauthorized'
    | 'Bad request'
    | 'Forbidden'
}) => {
  let status: 500 | 501 | 400 | 401 | 403 | 404 | 409 = 500
  const error = message ?? 'Internal server error'
  switch (message) {
    case 'Not implemented': {
      status = 501
      break
    }
    case 'Internal server error': {
      status = 500
      break
    }
    case 'Unauthorized': {
      status = 401
      break
    }
    case 'Bad request': {
      status = 400
      break
    }
    case 'Forbidden': {
      status = 403
      break
    }
    default: {
      status = 500
      break
    }
  }
  const responseServer: ResponseServer = {
    statusText: 'ERROR',
    status,
    error,
  }
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(status).json(responseServer)
}

export const formatResponseWarning = ({
  message,
  res,
}: {
  res: Response
  message?: 'Resource already exists' | 'Resource not found'
}) => {
  let status: 500 | 501 | 400 | 401 | 403 | 404 | 409 = 500
  const warning = message ?? 'Internal server error'
  switch (message) {
    case 'Resource already exists': {
      status = 409
      break
    }
    case 'Resource not found': {
      status = 404
      break
    }
    default: {
      status = 500
      break
    }
  }
  const responseServer: ResponseServer = {
    statusText: 'WARNING',
    status,
    warning,
  }
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(status).json(responseServer)
}

export const formatResponse = ({
  message,
  res,
  owner,
  token,
  profiles,
  projects,
  tasks,
  members,
}: {
  message: 'CREATED' | 'OK' | 'GET' | 'UPDATED' | 'DELETED'
  res: Response
  owner?: { id: string; name: string }
  token?: string
  profiles?: User[]
  projects?: Project[]
  tasks?: Task[]
  members?: Member[]
}): void => {
  const responseServer: ResponseServer = {
    statusText: 'SUCCESS',
    status: 200,
  }
  switch (message) {
    case 'CREATED': {
      console.log(
        'RESPONSE:',
        'Resource created',
        profiles,
        members,
        projects,
        tasks
      )
      responseServer.statusText = 'SUCCESS'
      responseServer.status = 201
      responseServer.message = 'Resource created'
      responseServer.profiles = profiles
      responseServer.members = members
      responseServer.projects = projects
      responseServer.tasks = tasks
      responseServer.count =
        profiles?.length ||
        members?.length ||
        projects?.length ||
        tasks?.length ||
        0
      break
    }
    case 'OK': {
      console.log('RESPONSE:', 'OK', owner, token)
      responseServer.statusText = 'SUCCESS'
      responseServer.status = 202
      responseServer.owner = owner
      responseServer.token = token
      break
    }
    case 'GET': {
      console.log(
        'RESPONSE:',
        'Get Resource',
        profiles,
        members,
        projects,
        tasks
      )
      responseServer.statusText = 'SUCCESS'
      responseServer.status = 200
      responseServer.profiles = profiles
      responseServer.members = members
      responseServer.projects = projects
      responseServer.tasks = tasks
      responseServer.count =
        profiles?.length ||
        members?.length ||
        projects?.length ||
        tasks?.length ||
        0
      break
    }
    case 'UPDATED': {
      console.log(
        'RESPONSE:',
        'Resource updated',
        profiles,
        members,
        projects,
        tasks
      )
      responseServer.statusText = 'SUCCESS'
      responseServer.status = 200
      responseServer.message = 'Resource updated'
      responseServer.profiles = profiles
      responseServer.members = members
      responseServer.projects = projects
      responseServer.tasks = tasks
      responseServer.count =
        profiles?.length ||
        members?.length ||
        projects?.length ||
        tasks?.length ||
        0
      break
    }
    case 'DELETED': {
      console.log('S07', 'Delete Resourse')
      responseServer.statusText = 'SUCCESS'
      responseServer.status = 204
      break
    }
  }
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(responseServer.status).json(responseServer)
}
