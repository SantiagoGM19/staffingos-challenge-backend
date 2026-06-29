import env from '#start/env'
import Post from '#models/post'
import User from '#models/user'
import { inject } from '@adonisjs/core'
import { HttpClient } from '#utils/http_client'

@inject()
export class JsonplaceholderService {

    private readonly JSONPLACEHOLDER_URL = env.get('JSONPLACEHOLDER_URL')

    constructor(protected httpClient: HttpClient) { }

    async getPostsByUser(userId: number): Promise<Post[]> {
        const data = await this.httpClient.makeRequest<Post[]>(`${this.JSONPLACEHOLDER_URL}/posts?userId=${userId}`, undefined, 'fetching posts')
        return data.map((post) => new Post(post.title, post.body, post.userId, post.id)) 
    }

    async getUserByEmail(email: string): Promise<User[]> {
        const data = await this.httpClient.makeRequest<User[]>(`${this.JSONPLACEHOLDER_URL}/users?email=${email}`, undefined, 'fetching user by email')
        return data.map((user) => new User(user.id, user.name, user.username, user.email)) 
    }

    async createPost(post: Post): Promise<Post> {
        const data = await this.httpClient.makeRequest<Post>(`${this.JSONPLACEHOLDER_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: post.userId, title: post.title, body: post.body }),
        }, 'creating post')
        return new Post(data.title, data.body, data.userId, data.id) 
    }

    async updatePost(postId: number, post: Post): Promise<Post> {
        const data = await this.httpClient.makeRequest<Post>(`${this.JSONPLACEHOLDER_URL}/posts/${postId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: post.userId, title: post.title, body: post.body }),
        }, 'updating post')
        return new Post(data.title, data.body, data.userId, data.id) 
    }

    async deletePost(postId: number): Promise<void> {
        await this.httpClient.makeRequest<void>(`${this.JSONPLACEHOLDER_URL}/posts/${postId}`, {
            method: 'DELETE',
        }, 'deleting post')
    }

}