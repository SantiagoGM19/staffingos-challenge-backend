import { Exception } from "@adonisjs/core/exceptions"
import { HttpContext } from "@adonisjs/core/http"

export default class ApplicationException extends Exception {
    
    static status = 500
    
    handle(error: this, {response}: HttpContext){
        return response
            .status(error.status)
            .send('An unexpected error occurred. Please try again later.')
    }
}