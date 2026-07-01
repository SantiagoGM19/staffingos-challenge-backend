import { test } from '@japa/runner'
import UserSession from '#models/user_session'

test.group('Models | User Session', () => {
  test('should have correct static table property', ({ assert }) => {
    assert.equal(UserSession.table, 'user_sessions')
  })

  test('should correctly set model properties', ({ assert }) => {
    const session = new UserSession()
    session.externalUserId = 1
    session.token = 'abc'
    session.isActive = true

    assert.equal(session.externalUserId, 1)
    assert.equal(session.token, 'abc')
    assert.isTrue(session.isActive)
  })
})
