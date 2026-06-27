import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import { ApiResponse } from '#utils/api_response'

export default class ExternalServiceHttpException extends Exception {

  static status = 502

  constructor(message: string = 'External service returned an HTTP error') {
    super(message, { status: 502 })
  }

  async handle(error: this, ctx: HttpContext) {
    return ctx.response
      .status(error.status)
      .json(ApiResponse.error(error.message))
  }

  async report(error: this, ctx: HttpContext) {
    ctx.logger.error({ err: error }, 'ExternalServiceHttpException: ' + error.message)
  }
}
