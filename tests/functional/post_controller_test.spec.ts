import { test } from '@japa/runner'
import UserSession from '#models/user_session'
import testUtils from '@adonisjs/core/services/test_utils'
import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { JsonplaceholderService } from '#services/jsonplaceholder_service'
import Post from '#models/post'
import jwt from 'jsonwebtoken'
import { DateTime } from 'luxon'

test.group('Functional / Post Controller', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  let validToken: string

  group.each.setup(async () => {
    // 1. Mock the API Service
    app.container.swap(JsonplaceholderService, () => {
      return {
        async getPostsByUser(userId: number) {
          if (Number(userId) === 1) {
             return [new Post('Title 1', 'Body 1', Number(userId), 101)]
          }
          return []
        },
        async createPost(post: Post) {
          return new Post(post.title, post.body, post.userId, 102)
        },
        async updatePost(id: number, post: Post) {
          return new Post(post.title, post.body, post.userId, id)
        },
        async deletePost(id: number) {
          return undefined
        }
      } as unknown as JsonplaceholderService
    })

    // 2. Setup a valid session for the Auth Middleware
    const userId = 1
    const secret = env.get('JWT_SECRET')
    validToken = jwt.sign({ sub: userId, email: 'test@example.com' }, secret, {
      expiresIn: '1h',
      issuer: 'staffingos-challenge',
    })

    const createdAt = DateTime.now()
    const expiresAt = createdAt.plus({ hours: 1 })
    await UserSession.create({ 
      externalUserId: userId, 
      token: validToken, 
      isActive: true, 
      createdAt, 
      expiresAt 
    })

    return () => app.container.restore(JsonplaceholderService)
  })

  test('should fail if unauthenticated', async ({ client }) => {
    // Act & Assert
    const response = await client.get('/posts/1')
    response.assertStatus(401)
  })

  test('should get posts by user id', async ({ client, assert }) => {
    // Act & Assert
    const response = await client.get('/posts/1').header('Authorization', `Bearer ${validToken}`)
    
    response.assertStatus(200)
    response.assertBodyContains({
      status: 'success',
      message: 'Posts retrieved successfully',
    })
    
    const data = response.body().data
    assert.isArray(data)
    assert.lengthOf(data, 1)
    assert.equal(data[0].title, 'Title 1')
  })

  test('should create post', async ({ client, assert }) => {
    // Act & Assert
    const response = await client.post('/posts').header('Authorization', `Bearer ${validToken}`).json({
        title: 'New Post',
        body: 'New Body',
        userId: 1
    })
    
    response.assertStatus(200)
    response.assertBodyContains({
      status: 'success',
      message: 'Post created successfully',
    })

    const data = response.body().data
    assert.equal(data.id, 102)
    assert.equal(data.title, 'New Post')
  })

  test('should update post', async ({ client, assert }) => {
    // Act & Assert
    const response = await client.put('/posts/105').header('Authorization', `Bearer ${validToken}`).json({
        title: 'Updated Post',
        body: 'Updated Body',
        userId: 1
    })
    
    response.assertStatus(200)
    response.assertBodyContains({
      status: 'success',
      message: 'Post updated successfully',
    })

    const data = response.body().data
    assert.equal(data.id, 105)
    assert.equal(data.title, 'Updated Post')
  })

  test('should delete post', async ({ client }) => {
    // Act & Assert
    const response = await client.delete('/posts/105').header('Authorization', `Bearer ${validToken}`)
    
    response.assertStatus(200)
    response.assertBodyContains({
      status: 'success',
      message: 'Post deleted successfully',
      data: null
    })
  })

  test('should fail validation on create post with missing fields', async ({ client }) => {
    // Act & Assert
    const response = await client.post('/posts').header('Authorization', `Bearer ${validToken}`).json({
        title: 'New Post' // Missing body and userId
    })
    
    response.assertStatus(422)
  })
})
