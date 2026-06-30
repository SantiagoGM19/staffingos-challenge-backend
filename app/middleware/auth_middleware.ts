import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { HttpUtils } from '#utils/http_utils'
import { ApiResponse } from '#utils/api_response'
import UserSession from '#models/user_session'
import env from '#start/env'
import jwt from 'jsonwebtoken'

export default class AuthMiddleware {
  private readonly jwtSecret = env.get('JWT_SECRET')

  async handle({ request, response }: HttpContext, next: NextFn) {
    const token = this.extractToken(request.header('Authorization'))

    if (!token) {
      return response.unauthorized(ApiResponse.error('Unauthorized: missing or malformed Authorization header'))
    }

    if (!(await this.verifyToken(token))) {
      return response.unauthorized(ApiResponse.error('Unauthorized: invalid or expired token'))
    }

    if (!await this.hasActiveSession(token)) {
      return response.unauthorized(ApiResponse.error('Unauthorized: session not found or has been revoked'))
    }

    return next()
  }

  private extractToken(authHeader: string | undefined): string | null {
    if (!authHeader?.toLowerCase().startsWith('bearer ')) return null
    const token = HttpUtils.extractBearerToken(authHeader)
    return token || null
  }

  private async verifyToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, this.jwtSecret)
      return true
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // Automatically set the expired token as inactive in the database
        await UserSession.query().where('token', token).update({ isActive: false })
      }
      return false
    }
  }

  private async hasActiveSession(token: string): Promise<boolean> {
    const session = await UserSession.findBy({ token, isActive: true })
    return session !== null
  }
}
