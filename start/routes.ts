/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'

import { ApiResponse } from '#utils/api_response'

router.get('/', () => {
  return ApiResponse.success({ hello: 'world' })
})

router.group(() => {
  router.post('/login', [AuthController, 'login']).as('auth.login')
  router.post('/logout', [AuthController, 'logout']).as('auth.logout')
}).prefix('/auth')
