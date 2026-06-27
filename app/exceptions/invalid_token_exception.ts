import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class InvalidTokenException extends Exception {

  static status = 401

  async handle(error: this, ctx: HttpContext) {
    return ctx.response
      .status(error.status)
      .json({ message: 'The provided token is invalid or has expired' })
  }

  async report(error: this, ctx: HttpContext) {
    ctx.logger.error({ err: error }, 'InvalidTokenException: Invalid or expired token')
  }
}
