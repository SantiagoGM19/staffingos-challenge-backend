import { Exception } from "@adonisjs/core/exceptions"
import { HttpContext } from "@adonisjs/core/http"
import { ApiResponse } from "#utils/api_response"

export default class InvalidCredentialsException extends Exception {
  
  static status = 401

  constructor(message: string = 'Invalid email or password provided') {
    super(message, { status: 401 })
  }

  async handle(error: this, ctx: HttpContext) {
    return ctx.response
      .status(error.status)
      .json(ApiResponse.error(error.message))
  }

  async report(error: this, ctx: HttpContext) {
    ctx.logger.error({ err: error }, 'InvalidCredentialsException: ' + error.message)
  }
}   