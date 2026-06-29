import { inject } from '@adonisjs/core'
import { JsonplaceholderService } from '#services/jsonplaceholder_service'
import { HttpContext } from '@adonisjs/core/http'
import { ApiResponse } from '#utils/api_response'
import Post from '#models/post'
import { createAndUpdatePostValidator } from '#validators/posts'

@inject()
export default class PostController {
  constructor(protected jsonplaceholderService: JsonplaceholderService) {}

  async getPosts({ params, response }: HttpContext) {
    const posts = await this.jsonplaceholderService.getPostsByUser(params.userId)
    return response.ok(ApiResponse.success(posts, 'Posts retrieved successfully'))
  }

  async createPost({ request, response }: HttpContext) {
    const { title, body, userId } = await request.validateUsing(createAndUpdatePostValidator)
    const payload = new Post(title, body, userId)
    const post = await this.jsonplaceholderService.createPost(payload)
    return response.ok(ApiResponse.success(post, 'Post created successfully'))
  }

  async updatePost({ params, request, response }: HttpContext) {
    const { title, body, userId } = await request.validateUsing(createAndUpdatePostValidator)
    const payload = new Post(title, body, userId, params.id)
    const post = await this.jsonplaceholderService.updatePost(params.id, payload)
    return response.ok(ApiResponse.success(post, 'Post updated successfully'))
  }

  async deletePost({ params, response }: HttpContext) {
    await this.jsonplaceholderService.deletePost(params.id)
    return response.ok(ApiResponse.success(null, 'Post deleted successfully'))
  }
}