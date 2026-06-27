import { AuthService } from '#services/auth_service'
import { loginValidator } from '#validators/auth'
import { HttpUtils } from '#utils/http_utils'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {

    constructor(protected authService: AuthService) {}

    async login({ request }: HttpContext){
        const {email, password} = await request.validateUsing(loginValidator)
        return await this.authService.login(email, password)
    }

    async logout({ request, response }: HttpContext) {
        const authHeader = request.header('Authorization')
        const token = HttpUtils.extractBearerToken(authHeader)
        if (!token) {
            return response.unauthorized('Authorization token is missing')
        }
        await this.authService.logout(token)
        return response.noContent()
    }
}