import InvalidCredentialsException from '#exceptions/invalid_credentials_exception'
import UserSession from '#models/user_session'
import env from '#start/env'
import { DateTime } from 'luxon'
import jwt from 'jsonwebtoken'

export class AuthService {
  private readonly PASSWORD = env.get('PASSWORD')
  private readonly BASE_URL = env.get('BASE_URL')
  private readonly JWT_SECRET = env.get('JWT_SECRET')
  private readonly TOKEN_TTL_HOURS = 1

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.fetchUserByEmail(email)

    if (!user || password !== this.PASSWORD) throw new InvalidCredentialsException()

    const token = this.generateToken(user.id, email)
    await this.persistSession(user.id, token)

    return { token }
  }

  private async fetchUserByEmail(email: string) {
    const response = await fetch(`${this.BASE_URL}/users?email=${email}`)
    const data = (await response.json()) as any[]
    return data.length === 1 ? data[0] : null
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
}