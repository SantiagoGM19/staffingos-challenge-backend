import { test } from '@japa/runner'
import { JsonplaceholderService } from '#services/jsonplaceholder_service'
import { HttpClient } from '#utils/http_client'
import Post from '#models/post'

test.group('Services jsonplaceholder service test', () => {
  test('should return posts by userId', async ({ assert }) => {

    const mockPosts = [
          {
            id: 1,
            title: 'Post 1',
            body: 'Body 1',
            userId: 1
          }
        ]

    const httpClientMock = {
      async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const posts = mockPosts
        
        return posts as T
      }
    } as unknown as HttpClient
    
    const jsonplaceholderService = new JsonplaceholderService(httpClientMock)
    const posts = await jsonplaceholderService.getPostsByUser(1)
    
    assert.deepEqual(posts, mockPosts)
  })

  test('should return user by email', async ({ assert }) => {

    const testEmail = 'username1@email.com'

    const mockUser = {
        id: 1,
        name: 'User 1',
        username: 'username1',
        email: testEmail
    }

    const httpClientMock = {
      async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const user = mockUser
        return [user] as T
      }
    } as unknown as HttpClient
    
    const jsonplaceholderService = new JsonplaceholderService(httpClientMock)
    const user = await jsonplaceholderService.getUserByEmail(testEmail)
    
    assert.deepEqual(user, [mockUser])
  })

  test('should create post', async ({ assert }) => {
    const mockPost = {
        id: 1,
        title: 'Post 1',
        body: 'Body 1',
        userId: 1
    }
    const httpClientMock = {
      async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const post = mockPost
        return post as T
      }
    } as unknown as HttpClient
    const jsonplaceholderService = new JsonplaceholderService(httpClientMock)
    const post = await jsonplaceholderService.createPost(new Post('Post 1', 'Body 1', 1))
    assert.deepEqual(post, mockPost)
  })

  test('should update post', async ({assert}) => {
    const mockPost = {
        id: 1,
        title: 'Post 1',
        body: 'Body 1',
        userId: 1
    }
    const httpClientMock = {
      async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const post = mockPost
        return post as T
      }
    } as unknown as HttpClient
    const jsonplaceholderService = new JsonplaceholderService(httpClientMock)
    const post = await jsonplaceholderService.updatePost(1, new Post('Post 1', 'Body 1', 1))
    assert.deepEqual(post, mockPost)
  })

  test('should delete post', async ({assert}) => {
    const httpClientMock = {
      async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        return null as T
      }
    } as unknown as HttpClient
    const jsonplaceholderService = new JsonplaceholderService(httpClientMock)

    assert.isNull(await jsonplaceholderService.deletePost(1))
  })
})