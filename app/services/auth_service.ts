import InvalidCredentialsException from '#exceptions/invalid_credentials_exception'
import UserSession from '#models/user_session'
import env from '#start/env'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'

export class AuthService {

    private readonly PASSWORD = env.get('PASSWORD')
    private readonly BASE_URL = env.get('BASE_URL')

   async login(email: string, password: string): Promise<void> {
    const response = await fetch(this.BASE_URL + '/users?email=' + email)
    const data: any = await response.json()
    if(data.length === 1 && password === this.PASSWORD){
        await UserSession.create({
            externalUserId: data[0].id,
            token: randomUUID(),
            isActive: true,
            expiresAt: DateTime.now().plus({ hours: 1 })
        })
        return
    }
    throw new InvalidCredentialsException()
  }
}