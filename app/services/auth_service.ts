import InvalidCredentialsException from '#exceptions/invalid_credentials_exception'
import InvalidTokenException from '#exceptions/invalid_token_exception'
import UserSession from '#models/user_session'
import env from '#start/env'
import { DateTime } from 'luxon'
import jwt from 'jsonwebtoken'
import { inject } from '@adonisjs/core'
import { JsonplaceholderService } from '#services/jsonplaceholder_service'
import User from '#models/user'

@inject()
export class AuthService {
  private readonly PASSWORD = env.get('PASSWORD')
  private readonly JWT_SECRET = env.get('JWT_SECRET')
  private readonly TOKEN_TTL_HOURS = 1

  constructor(protected jsonplaceholderService: JsonplaceholderService) {}

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const data = await this.jsonplaceholderService.getUserByEmail(email)
    const user = data.length === 1 ? data[0] : null

    if (!user || password !== this.PASSWORD) throw new InvalidCredentialsException()

    await this.invalidatePreviousSessions(user.id)

    const token = this.generateToken(user.id, user.email)
    await this.persistSession(user.id, token)

    return { user, token }
  }

  async logout(token: string): Promise<void> {
    try {
      jwt.verify(token, this.JWT_SECRET)
    } catch {
      throw new InvalidTokenException()
    }

    const session = await UserSession.findBy({ token, isActive: true })
    if (session) {
      session.isActive = false
      await session.save()
    }
  }

  private generateToken(userId: number, email: string): string {
    return jwt.sign({ sub: userId, email }, this.JWT_SECRET, {
      expiresIn: `${this.TOKEN_TTL_HOURS}h`,
      issuer: 'staffingos-challenge',
    })
  }

  private async persistSession(userId: number, token: string): Promise<void> {
    const createdAt = DateTime.now()
    const expiresAt = createdAt.plus({ hours: this.TOKEN_TTL_HOURS })
    await UserSession.create({ externalUserId: userId, token, isActive: true, createdAt, expiresAt })
  }

  private async invalidatePreviousSessions(userId: number): Promise<void> {
    await UserSession.query()
      .where('externalUserId', userId)
      .where('isActive', true)
      .update({ isActive: false })
  }
}