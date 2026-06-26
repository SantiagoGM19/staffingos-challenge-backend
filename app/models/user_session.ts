import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserSession extends BaseModel {
  static table = 'user_sessions'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare externalUserId: number

  @column()
  declare token: string

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime()
  declare expiresAt: DateTime
  
}