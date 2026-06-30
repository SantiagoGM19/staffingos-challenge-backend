import { test } from '@japa/runner'
import UserSession from '#models/user_session'
import testUtils from '@adonisjs/core/services/test_utils'
import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { JsonplaceholderService } from '#services/jsonplaceholder_service'
import User from '#models/user'

test.group('Functional / Auth Controller', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  const validEmail = 'test@example.com'
  const validPassword = env.get('PASSWORD')

  group.each.setup(() => {
    app.container.swap(JsonplaceholderService, () => {
      return {
        async getUserByEmail(email: string) {
          if (email === validEmail) {
            return [new User(1, 'Fake User', 'fakeuser', validEmail)]
          }
          return []
        }
      } as unknown as JsonplaceholderService
    })

    return () => app.container.restore(JsonplaceholderService)
  })

  test('should login successfully with valid credentials', async ({ client, assert }) => {

    //Act & Assert
    const response = await client.post('/auth/login').json({
      email: validEmail,
      password: validPassword,
    })
    response.assertStatus(200)
    response.assertBodyContains({
      status: 'success',
      message: 'Login successful',
    })
    
    const body = response.body() as any
    assert.properties(body.data, ['user', 'token'])
    assert.equal(body.data.user.email, validEmail)
  })

  test('should fail login with invalid password', async ({ client }) => {
    //Act & Assert
    const response = await client.post('/auth/login').json({
      email: validEmail,
      password: 'wrongpassword',
    })

    response.assertStatus(401)
    response.assertBodyContains({
      status: 'error',
      message: 'Invalid email or password provided',
    })
  })

  test('should fail login with non-existent user', async ({ client }) => {
    //Act & Assert
    const response = await client.post('/auth/login').json({
      email: 'nonexistent@example.com',
      password: validPassword,
    })
    response.assertStatus(401)
    response.assertBodyContains({
      status: 'error',
      message: 'Invalid email or password provided',
    })
  })

  test('should logout successfully with valid token', async ({ client, assert }) => {
    //Arrange
    const loginResponse = await client.post('/auth/login').json({
      email: validEmail,
      password: validPassword,
    })
    
    loginResponse.assertStatus(200)
    const loginBody = loginResponse.body() as any
    const token = loginBody.data.token
    
    let session = await UserSession.findBy('token', token)
    assert.isNotNull(session)
    assert.isTrue(Boolean(session!.isActive))

    //Act
    const logoutResponse = await client.post('/auth/logout').header('Authorization', `Bearer ${token}`)
    
    //Assert
    logoutResponse.assertStatus(204)

    session = await UserSession.findBy('token', token)
    assert.isFalse(Boolean(session!.isActive))
  })

  test('should fail logout with invalid token', async ({ client }) => {
    //Act & Assert
    const response = await client.post('/auth/logout').header('Authorization', `Bearer invalid-token`)
    response.assertStatus(401)
    response.assertBodyContains({
      status: 'error',
      message: 'The provided token is invalid or has expired',
    })
  })

  test('should fail logout without token', async ({ client }) => {
    //Act & Assert
    const response = await client.post('/auth/logout')
    response.assertStatus(401)
    response.assertBodyContains({
      status: 'error',
      message: 'Authorization token is missing',
    })
  })
})
