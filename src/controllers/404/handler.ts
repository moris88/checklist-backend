import { Request, Response } from 'express'
import { formatResponseError } from '@/libs'

export function generalPathMatch(req: Request, res: Response) {
  try {
    return formatResponseError({
      message: 'Not implemented',
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
