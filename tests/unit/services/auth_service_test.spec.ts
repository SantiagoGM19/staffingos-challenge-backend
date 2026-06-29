import { AuthService } from '#services/auth_service'
import { test } from '@japa/runner'
import { JsonplaceholderService } from '#services/jsonplaceholder_service'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import env from '#start/env'
import UserSession from '#models/user_session'
import InvalidCredentialsException from '#exceptions/invalid_credentials_exception'
import InvalidTokenException from '#exceptions/invalid_token_exception'
import { DateTime } from 'luxon'

test.group('Services auth service test', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('should return user and token when credentials are valid', async ({ assert }) => {
    // Arrange
    const mockEmail = 'test@example.com'
    const mockPassword = env.get('PASSWORD')

    const mockJsonplaceholderService = {
      getUserByEmail: async (email: string) => {
        return [new User(1, 'Test User', 'testuser', email)]
      }
    } as unknown as JsonplaceholderService

    const authService = new AuthService(mockJsonplaceholderService)

    // Act
    const result = await authService.login(mockEmail, mockPassword)

    // Assert
    assert.properties(result, ['user', 'token'])
    assert.equal(result.user.email, mockEmail)
    assert.isString(result.token)
    
    const dbSession = await UserSession.findBy('token', result.token)
    assert.isNotNull(dbSession)
    assert.isTrue(Boolean(dbSession!.isActive))
    assert.equal(dbSession!.externalUserId, 1)
  })

  test('should throw InvalidCredentialsException when user is not found', async ({ assert }) => {
    // Arrange
    const mockEmail = 'test@example.com'
    const mockPassword = env.get('PASSWORD')

    const mockJsonplaceholderService = {
      getUserByEmail: async (email: string) => {
        return []
      }
    } as unknown as JsonplaceholderService

    const authService = new AuthService(mockJsonplaceholderService)

    // Act & Assert
    await assert.rejects(async () => {
      await authService.login(mockEmail, mockPassword)
    }, InvalidCredentialsException)
  })

  test('should throw InvalidCredentialsException when password is wrong', async ({ assert }) => {
    // Arrange
    const mockEmail = 'test@example.com'

    const mockJsonplaceholderService = {
      getUserByEmail: async (email: string) => {
        return [new User(1, 'Test User', 'testuser', email)]
      }
    } as unknown as JsonplaceholderService

    const authService = new AuthService(mockJsonplaceholderService)

    // Act & Assert
    await assert.rejects(async () => {
      await authService.login(mockEmail, 'wrong-password')
    }, InvalidCredentialsException)
  })

  test('should throw InvalidTokenException when token is invalid', async ({ assert }) => {
    // Arrange
    const mockJsonplaceholderService = {} as JsonplaceholderService
    const authService = new AuthService(mockJsonplaceholderService)
    
    // Act & Assert
    await assert.rejects(async () => {
      await authService.logout('fake-token')
    }, InvalidTokenException)
  })

  test('should logout user and inactivate session', async ({ assert }) => {
    // Arrange
    const mockJsonplaceholderService = {} as JsonplaceholderService
    const authService = new AuthService(mockJsonplaceholderService)
    
    const validToken = (authService as any).generateToken(1, 'test@example.com')

    const session = new UserSession()
    session.externalUserId = 1
    session.token = validToken
    session.isActive = true
    session.expiresAt = DateTime.now().plus({ hours: 1 })
    await session.save()
    
    // Act
    await authService.logout(validToken)
    
    // Assert
    const updatedSession = await UserSession.findBy('token', validToken)
    assert.isNotNull(updatedSession)
    assert.isFalse(Boolean(updatedSession!.isActive))
  })
})