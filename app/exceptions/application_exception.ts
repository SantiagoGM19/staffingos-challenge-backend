import { Exception } from "@adonisjs/core/exceptions"
import { HttpContext } from "@adonisjs/core/http"

export default class ApplicationException extends Exception {
    
    static status = 500
    
    constructor(message: string = 'An unexpected error occurred. Please try again later.') {
        super(message, { status: 500 })
    }

    async handle(error: this, ctx: HttpContext) {
        return ctx.response
            .status(error.status)
            .json({ message: error.message })
    }

    async report(error: this, ctx: HttpContext) {
        ctx.logger.error({ err: error }, 'ApplicationException: ' + error.message)
    }
}