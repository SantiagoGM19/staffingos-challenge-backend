import { test } from '@japa/runner'
import { loginValidator } from '#validators/auth'

test.group('Validators | Auth', () => {
  test('should validate correct login payload', async ({ assert }) => {
    const payload = { email: 'test@example.com', password: 'password123' }
    const result = await loginValidator.validate(payload)
    assert.deepEqual(result, payload)
  })

  test('should fail if email is invalid', async ({ assert }) => {
    const payload = { email: 'not-an-email', password: 'password123' }
    try {
      await loginValidator.validate(payload)
      assert.fail('Should have thrown')
    } catch (error: any) {
      assert.exists(error.messages)
      assert.equal(error.messages[0].field, 'email')
    }
  })

  test('should fail if password is too short', async ({ assert }) => {
    const payload = { email: 'test@example.com', password: 'short' }
    try {
      await loginValidator.validate(payload)
      assert.fail('Should have thrown')
    } catch (error: any) {
      assert.exists(error.messages)
      assert.equal(error.messages[0].field, 'password')
    }
  })
})
