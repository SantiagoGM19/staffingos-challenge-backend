import { AuthService } from '#services/auth_service'
import { loginValidator } from '#validators/auth'
import { HttpUtils } from '#utils/http_utils'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { ApiResponse } from '#utils/api_response'

@inject()
export default class AuthController {

    constructor(protected authService: AuthService) {}

    async login({ request, response }: HttpContext){
        const {email, password} = await request.validateUsing(loginValidator)
        const result = await this.authService.login(email, password)
        return response.ok(ApiResponse.success(result, 'Login successful'))
    }

    async logout({ request, response }: HttpContext) {
        const authHeader = request.header('Authorization')
        const token = HttpUtils.extractBearerToken(authHeader)
        if (!token) {
            return response.unauthorized(ApiResponse.error('Authorization token is missing'))
        }
        await this.authService.logout(token)
        return response.noContent()
    }
}