import {
  formatResponse,
  formatResponseError,
  formatResponseWarning,
  getUserByToken,
  readDatabase,
} from '@/libs'
import { Request, Response } from 'express'
import { Member, Project, Search, Task } from '@/types'

export async function search(req: Request, res: Response) {
  try {
    const { body } = req
    console.log('body', body)
    if (!body) {
      return formatResponseError({
        message: 'Bad request',
        res,
      })
    }
    const { module, field, where, search } = body as Search
    const myUser = await getUserByToken(req.headers?.authorization ?? '')
    if (myUser) {
      if (!module || !field || !where || !search) {
        return formatResponseError({
          message: 'Bad request',
          res,
        })
      }
      if (module !== 'projects' && module !== 'members' && module !== 'tasks') {
        return formatResponseError({
          message: 'Bad request',
          res,
        })
      }
      if (
        where === 'greater' ||
        where === 'less' ||
        where === 'greaterEqual' ||
        where === 'lessEqual'
      ) {
        if (typeof search !== 'number') {
          return formatResponseError({
            message: 'Bad request',
            res,
          })
        }
        if (isNaN(search)) {
          return formatResponseError({
            message: 'Bad request',
            res,
          })
        }
      }
      if (module === 'projects') {
        const projects = await readDatabase<Project>('projects')
        const myProjects = projects.filter((p) => p.owner.id === myUser.id)
        if (myProjects.length === 0) {
          return formatResponseWarning({
            message: 'Resource not found',
            res,
          })
        }
        let searchProjects: Project[] = []
        if (where === 'equal') {
          if (field.includes('members.name')) {
            searchProjects = myProjects.filter(
              (p) =>
                p.members.filter(
                  (el: { name: string; id: string }) => el.name === search
                ).length > 0
            )
          } else if (field.includes('members.id')) {
            searchProjects = myProjects.filter(
              (p) =>
                p.members.filter(
                  (el: { name: string; id: string }) => el.id === search
                ).length > 0
            )
          } else {
            searchProjects = myProjects.filter((p) => p[field] === search)
          }
        } else if (where === 'contain') {
          if (field.includes('members.name')) {
            searchProjects = myProjects.filter(
              (p) =>
                p.members.filter((el: { name: string; id: string }) =>
                  el.name.includes(search)
                ).length > 0
            )
          } else if (field.includes('members.id')) {
            searchProjects = myProjects.filter(
              (p) =>
                p.members.filter((el: { name: string; id: string }) =>
                  el.id.includes(search)
                ).length > 0
            )
          } else {
            searchProjects = myProjects.filter((p) => p[field].includes(search))
          }
        } else if (where === 'start') {
          if (field.includes('members.name')) {
            searchProjects = myProjects.filter(
              (p) =>
                p.members.filter((el: { name: string; id: string }) =>
                  el.name.startsWith(search)
                ).length > 0
            )
          } else if (field.includes('members.id')) {
            searchProjects = myProjects.filter(
              (p) =>
                p.members.filter((el: { name: string; id: string }) =>
                  el.id.startsWith(search)
                ).length > 0
            )
          } else {
            searchProjects = myProjects.filter((p) =>
              p[field].startsWith(search)
            )
          }
        } else if (where === 'end') {
          if (field.includes('members.name')) {
            searchProjects = myProjects.filter(
              (p) =>
                p.members.filter((el: { name: string; id: string }) =>
                  el.name.endsWith(search)
                ).length > 0
            )
          } else if (field.includes('members.id')) {
            searchProjects = myProjects.filter(
              (p) =>
                p.members.filter((el: { name: string; id: string }) =>
                  el.id.endsWith(search)
                ).length > 0
            )
          } else {
            searchProjects = myProjects.filter((p) => p[field].endsWith(search))
          }
        } else if (where === 'greater') {
          searchProjects = myProjects.filter((t) => t[field] > search)
        } else if (where === 'less') {
          searchProjects = myProjects.filter((t) => t[field] < search)
        } else if (where === 'greaterEqual') {
          searchProjects = myProjects.filter((t) => t[field] >= search)
        } else if (where === 'lessEqual') {
          searchProjects = myProjects.filter((t) => t[field] <= search)
        } else {
          return formatResponseError({
            message: 'Bad request',
            res,
          })
        }
        if (searchProjects.length === 0) {
          return formatResponseWarning({
            message: 'Resource not found',
            res,
          })
        }
        return formatResponse({
          message: 'GET',
          res,
          projects: searchProjects,
        })
      } else if (module === 'members') {
        const members = await readDatabase<Member>('members')
        const myMembers = members.filter((m) => m.owner.id === myUser.id)
        if (myMembers.length === 0) {
          return formatResponseWarning({
            message: 'Resource not found',
            res,
          })
        }
        let searchMembers: Member[] = []
        if (where === 'equal') {
          searchMembers = myMembers.filter((m) => m[field] === search)
        } else if (where === 'contain') {
          searchMembers = myMembers.filter((m) => m[field].includes(search))
        } else if (where === 'start') {
          searchMembers = myMembers.filter((m) => m[field].startsWith(search))
        } else if (where === 'end') {
          searchMembers = myMembers.filter((m) => m[field].endsWith(search))
        } else if (where === 'greater') {
          searchMembers = myMembers.filter((t) => t[field] > search)
        } else if (where === 'less') {
          searchMembers = myMembers.filter((t) => t[field] < search)
        } else if (where === 'greaterEqual') {
          searchMembers = myMembers.filter((t) => t[field] >= search)
        } else if (where === 'lessEqual') {
          searchMembers = myMembers.filter((t) => t[field] <= search)
        } else {
          return formatResponseError({
            message: 'Bad request',
            res,
          })
        }
        if (searchMembers.length === 0) {
          return formatResponseWarning({
            message: 'Resource not found',
            res,
          })
        }
        return formatResponse({
          message: 'GET',
          res,
          members: searchMembers,
        })
      } else if (module === 'tasks') {
        const tasks = await readDatabase<Task>('tasks')
        const myTasks = tasks.filter((t) => t.owner.id === myUser.id)
        if (myTasks.length === 0) {
          return formatResponseWarning({
            message: 'Resource not found',
            res,
          })
        }
        let searchTasks: Task[] = []
        if (where === 'equal') {
          searchTasks = myTasks.filter((t) => t[field] === search)
        } else if (where === 'contain') {
          searchTasks = myTasks.filter((t) => t[field].includes(search))
        } else if (where === 'start') {
          searchTasks = myTasks.filter((t) => t[field].startsWith(search))
        } else if (where === 'end') {
          searchTasks = myTasks.filter((t) => t[field].endsWith(search))
        } else if (where === 'greater') {
          searchTasks = myTasks.filter((t) => t[field] > search)
        } else if (where === 'less') {
          searchTasks = myTasks.filter((t) => t[field] < search)
        } else if (where === 'greaterEqual') {
          searchTasks = myTasks.filter((t) => t[field] >= search)
        } else if (where === 'lessEqual') {
          searchTasks = myTasks.filter((t) => t[field] <= search)
        } else {
          return formatResponseError({
            message: 'Bad request',
            res,
          })
        }
        if (searchTasks.length === 0) {
          return formatResponseWarning({
            message: 'Resource not found',
            res,
          })
        }
        return formatResponse({
          message: 'GET',
          res,
          tasks: searchTasks,
        })
      }
    }
    return formatResponseError({
      message: 'Unauthorized',
      res,
    })
  } catch (error) {
    console.log('ERROR!', error)
    return formatResponseError({
      message: 'Internal server error',
      res,
    })
  }
}
