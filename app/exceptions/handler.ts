import app from '@adonisjs/core/services/app'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'

import { ApiResponse } from '#utils/api_response'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {
    if (error.name === 'ValidationException') {
      return ctx.response.status(422).json(ApiResponse.error('Validation error', error.messages))
    }

    // For generic errors without custom handle method
    if (!error.handle && error.status >= 400 && error.status < 600) {
      // Allow Adonis default error pages/JSON in debug mode for 500s unless we want to force API structure
      // We will force API structure for standard JSON APIs
      return ctx.response.status(error.status).json(ApiResponse.error(error.message || 'An error occurred'))
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
