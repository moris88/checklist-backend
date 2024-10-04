import { Request, Response, NextFunction } from 'express'
import { checkToken, formatResponseError } from '@/libs'

export async function authorizationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(`-->New request! - Path: ${req.path}`)
  console.log(`-->New request! - Method: ${req.method}`)
  console.log(`-->New request! - Body: ${JSON.stringify(req.body)}`)
  console.log(`-->New request! - Headers: ${JSON.stringify(req.headers)}`)
  if (
    !['/api/v1/login', '/api/v1/register', '/api/v1/logout'].includes(req.path)
  ) {
    const skip = ['/api/v1/refresh'].includes(req.path)
    const bearerToken = req.headers?.authorization ?? ''
    if (bearerToken) {
      if (await checkToken(bearerToken, skip)) {
        next()
        return
      }
    }
    return formatResponseError({
      message: 'Unauthorized',
      res,
    })
  }
  next()
  return
}
