import { AuthService } from '#services/auth_service'
import { loginValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {

    constructor(protected authService: AuthService) {}

    async login({ request }: HttpContext){
        const {email, password} = await request.validateUsing(loginValidator)
        return await this.authService.login(email, password)
    }
}