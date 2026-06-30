import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import UserSession from '#models/user_session'
import { DateTime } from 'luxon'

export default class PruneTokens extends BaseCommand {
  static commandName = 'tokens:prune'
  static description = 'Mark all expired tokens as inactive in the database'

  static options: CommandOptions = {
    startApp: true
  }

  async run() {
    this.logger.info('Pruning expired tokens...')
    
    // We update all active sessions where the expiresAt time has passed
    const query = await UserSession.query()
      .where('isActive', true)
      .where('expiresAt', '<', DateTime.now().toSQL())
      .update({ isActive: false })
      
    // The query returns an array of numbers representing affected rows depending on the driver
    // For Lucid with MySQL it returns the number of affected rows in the first element
    const count = Array.isArray(query) ? query[0] : query
    
    this.logger.success(`Pruned ${count} expired tokens.`)
  }
}