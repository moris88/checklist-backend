import {
  formatResponseError,
  formatResponseWarning,
  formatResponse,
  generateLongId,
  readDatabase,
  writeDatabase,
  getUserByToken,
} from '@/libs'
import { Request, Response } from 'express'
import { Member } from '@/types'

export async function createMember(req: Request, res: Response) {
  try {
    if (Object.keys(req.body).length === 0) {
      return formatResponseError({
        message: 'Bad request',
        res,
      })
    }
    const { member } = req.body as { member: Member }
    if (
      !member ||
      Object.keys(member).length === 0 ||
      !member.email ||
      !member.last_name
    ) {
      return formatResponseError({
        message: 'Bad request',
        res,
      })
    }
    const { email } = member
    const members = await readDatabase<Member>('members')
    if (members.filter((m: Member) => m.email === email).length > 0) {
      return formatResponseWarning({
        message: 'Resource already exists',
        res,
      })
    }
    const myMember = await getUserByToken(req.headers?.authorization ?? '')
    if (myMember) {
      const newMember = {
        ...member,
        id: generateLongId(),
        owner: { id: myMember.id, name: myMember.name },
      }
      members.push(newMember)
      if (await writeDatabase(members, 'members')) {
        return formatResponse({
          message: 'CREATED',
          res,
          members: [newMember],
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

export async function getMembers(req: Request, res: Response) {
  try {
    const members = await readDatabase<Member>('members')
    const myUser = await getUserByToken(req.headers?.authorization ?? '')
    if (myUser) {
      const myUsers = members.filter((u: Member) => u.owner.id === myUser.id)
      return formatResponse({
        message: 'GET',
        res,
        members: myUsers,
      })
    }
    return formatResponse({
      message: 'GET',
      res,
      members: [],
    })
  } catch (error) {
    console.log('ERROR!', error)
    return formatResponseError({
      message: 'Internal server error',
      res,
    })
  }
}

export async function getMember(req: Request, res: Response) {
  try {
    const { id } = req.params
    if (!id) {
      return formatResponseError({
        message: 'Bad request',
        res,
      })
    }
    const members = await readDatabase<Member>('members')
    const myUser = await getUserByToken(req.headers?.authorization ?? '')
    if (myUser) {
      const myUsers = members.filter(
        (u: Member) => u.owner.id === myUser.id && u.id === id
      )
      return formatResponse({
        message: 'GET',
        res,
        members: myUsers,
      })
    }
    return formatResponse({
      message: 'GET',
      res,
      members: [],
    })
  } catch (error) {
    console.log('ERROR!', error)
    return formatResponseError({
      message: 'Internal server error',
      res,
    })
  }
}

export async function deleteMember(req: Request, res: Response) {
  try {
    const { id } = req.params
    if (!id) {
      return formatResponseError({
        message: 'Bad request',
        res,
      })
    }
    const members = await readDatabase<Member>('members')
    const membersSearch = members.filter((m: Member) => m.id === id)
    if (membersSearch.length === 0) {
      return formatResponseWarning({
        message: 'Resource not found',
        res,
      })
    }
    const newMembers = members.filter((m: Member) => m.id !== id)
    if (!(await writeDatabase(newMembers, 'members'))) {
      throw new Error('Error deleting member')
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

export async function updateMember(req: Request, res: Response) {
  try {
    const { id } = req.params
    if (!id || Object.keys(req.body).length === 0) {
      return formatResponseError({
        message: 'Bad request',
        res,
      })
    }
    const { member } = req.body as { member: Member }
    if (!member || Object.keys(member).length === 0) {
      return formatResponseError({
        message: 'Bad request',
        res,
      })
    }
    const members = await readDatabase<Member>('members')
    const membersSearch = members.filter((m: Member) => m.id === id)
    if (membersSearch.length === 0) {
      return formatResponseWarning({
        message: 'Resource not found',
        res,
      })
    }
    const newMember = { ...membersSearch[0], ...member }
    const newMembers = [
      ...members.filter((m: Member) => m.id !== id),
      newMember,
    ]
    if (!(await writeDatabase(newMembers, 'members'))) {
      throw new Error('Error updating user')
    }
    return formatResponse({
      message: 'UPDATED',
      res,
      members: [newMember],
    })
  } catch (error) {
    console.log('ERROR!', error)
    return formatResponseError({
      message: 'Internal server error',
      res,
    })
  }
}
