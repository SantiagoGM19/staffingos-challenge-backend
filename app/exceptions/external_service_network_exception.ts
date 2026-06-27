import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class ExternalServiceNetworkException extends Exception {

  static status = 502

  constructor(message: string = 'Network error while communicating with an external service') {
    super(message, { status: 502 })
  }

  async handle(error: this, ctx: HttpContext) {
    return ctx.response
      .status(error.status)
      .json({ message: error.message })
  }

  async report(error: this, ctx: HttpContext) {
    ctx.logger.error({ err: error }, 'ExternalServiceNetworkException: ' + error.message)
  }
}
