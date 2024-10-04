import {
  checkObjects,
  formatResponseError,
  formatResponseWarning,
  formatResponse,
  generateLongId,
  getUserByToken,
  readDatabase,
  writeDatabase,
  includes,
} from '@/libs'
import { Request, Response } from 'express'
import { Task } from '@/types'

export async function createTask(req: Request, res: Response) {
  try {
    if (Object.keys(req.body).length === 0) {
      return formatResponseError({
        message: 'Bad request',
        res,
      })
    }
    const { task } = req.body as { task: Task }
    if (
      !task ||
      Object.keys(task).length === 0 ||
      !task.title ||
      !task.project
    ) {
      return formatResponseError({
        message: 'Bad request',
        res,
      })
    }
    if (!task.project?.id && !task.project?.name) {
      return formatResponseError({
        message: 'Bad request',
        res,
      })
    }
    if (task.assignee && task.assignee.length > 0) {
      if (!checkObjects(task.assignee)) {
        return formatResponseError({
          message: 'Bad request',
          res,
        })
      }
    }
    const tasks = await readDatabase<Task>('tasks')
    const myUser = await getUserByToken(req.headers?.authorization ?? '')
    if (myUser) {
      if (!includes('tasks', 'PriorityTask', task.priority)) {
        return formatResponseError({
          message: 'Forbidden',
          res,
        })
      }
      if (!includes('tasks', 'StatusTask', task.status)) {
        return formatResponseError({
          message: 'Forbidden',
          res,
        })
      }
      const newTasks: Task = {
        ...task,
        priority: task.priority ?? 'LOW',
        status: task.status ?? 'BACKLOG',
        owner: { id: myUser.id, name: myUser.name },
        id: generateLongId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      tasks.push(newTasks)
      if (await writeDatabase(tasks, 'tasks')) {
        return formatResponse({
          message: 'CREATED',
          res,
          tasks: [newTasks],
        })
      }
    }
    return formatResponseError({
      message: 'Bad request',
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

export async function getTasks(req: Request, res: Response) {
  try {
    const myUser = await getUserByToken(req.headers?.authorization ?? '')
    if (myUser) {
      const tasks = await readDatabase<Task>('tasks')
      const myTasks = tasks.filter((t) => t.owner.id === myUser.id)
      return formatResponse({
        message: 'GET',
        res,
        tasks: myTasks,
      })
    }
    return res.status(200).json(
      formatResponse({
        message: 'GET',
        res,
        tasks: [],
      })
    )
  } catch (error) {
    console.log('ERROR!', error)
    return formatResponseError({
      message: 'Internal server error',
      res,
    })
  }
}

export async function getTask(req: Request, res: Response) {
  try {
    const { id } = req.params
    if (!id) {
      return formatResponseError({
        message: 'Bad request',
        res,
      })
    }
    const myUser = await getUserByToken(req.headers?.authorization ?? '')
    if (myUser) {
      const tasks = await readDatabase<Task>('tasks')
      const myTasks = tasks.filter(
        (t) => t.owner.id === myUser.id && t.id === id
      )
      return formatResponse({
        message: 'GET',
        res,
        tasks: myTasks,
      })
    }
    return formatResponse({
      message: 'GET',
      res,
      projects: [],
    })
  } catch (error) {
    console.log('ERROR!', error)
    return formatResponseError({
      message: 'Internal server error',
      res,
    })
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const { id } = req.params
    if (!id) {
      return formatResponseError({
        message: 'Bad request',
        res,
      })
    }
    const tasks = await readDatabase<Task>('tasks')
    const tasksSearch = tasks.filter((t: Task) => t.id === id)
    if (tasksSearch.length === 0) {
      return formatResponseWarning({
        message: 'Resource not found',
        res,
      })
    }
    const newTasks = tasks.filter((t: Task) => t.id !== id)
    if (!(await writeDatabase(newTasks, 'tasks'))) {
      throw new Error('Error deleting task')
    }
    return formatResponse({
      message: 'DELETED',
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

export async function updateTask(req: Request, res: Response) {
  try {
    const { id } = req.params
    if (Object.keys(req.body).length === 0) {
      return formatResponseError({
        message: 'Bad request',
        res,
      })
    }
    const { task } = req.body as { task: Task }
    if (!id || !task || Object.keys(task).length === 0) {
      return formatResponseError({
        message: 'Bad request',
        res,
      })
    }
    if (!task.project || !task.project?.id || !task.project?.name) {
      return formatResponseError({
        message: 'Bad request',
        res,
      })
    }
    if (task.assignee && task.assignee.length > 0) {
      if (!checkObjects(task.assignee)) {
        return formatResponseError({
          message: 'Bad request',
          res,
        })
      }
    }
    const tasks = await readDatabase<Task>('tasks')
    const tasksSearch = tasks.filter((t: Task) => t.id === id)
    if (tasksSearch.length === 0) {
      return formatResponseWarning({
        message: 'Resource not found',
        res,
      })
    }
    if (!includes('tasks', 'PriorityTask', task.priority)) {
      return formatResponseError({
        message: 'Forbidden',
        res,
      })
    }
    if (!includes('tasks', 'StatusTask', task.status)) {
      return formatResponseError({
        message: 'Forbidden',
        res,
      })
    }
    const newTask: Task = {
      ...tasksSearch[0],
      ...task,
      updatedAt: new Date().toISOString(),
    }
    const newTasks = [...tasks.filter((t: Task) => t.id !== id), newTask]
    if (!(await writeDatabase(newTasks, 'tasks'))) {
      throw new Error('Error updating task')
    }
    return formatResponse({
      message: 'UPDATED',
      res,
      tasks: [newTask],
    })
  } catch (error) {
    console.log('ERROR!', error)
    return formatResponseError({
      message: 'Internal server error',
      res,
    })
  }
}
