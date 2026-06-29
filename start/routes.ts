import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'

import { ApiResponse } from '#utils/api_response'
import PostController from '#controllers/post_controller'
import { middleware } from '#start/kernel'

router.get('/', () => {
  return ApiResponse.success({ hello: 'world' })
})

router.group(() => {
  router.post('/login', [AuthController, 'login']).as('auth.login')
  router.post('/logout', [AuthController, 'logout']).as('auth.logout')
}).prefix('/auth')

router.group(() => {
  router.get('/:userId', [PostController, 'getPosts']).as('posts.get')
  router.post('/', [PostController, 'createPost']).as('posts.create')
  router.put('/:id', [PostController, 'updatePost']).as('posts.update')
  router.delete('/:id', [PostController, 'deletePost']).as('posts.delete')
}).prefix('/posts').use(middleware.auth())
