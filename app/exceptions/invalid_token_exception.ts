import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import { ApiResponse } from '#utils/api_response'

export default class InvalidTokenException extends Exception {

  static status = 401

  constructor(message: string = 'The provided token is invalid or has expired') {
    super(message, { status: 401 })
  }

  async handle(error: this, ctx: HttpContext) {
    return ctx.response
      .status(error.status)
      .json(ApiResponse.error(error.message))
  }

  async report(error: this, ctx: HttpContext) {
    ctx.logger.error({ err: error }, 'InvalidTokenException: ' + error.message)
  }
}
