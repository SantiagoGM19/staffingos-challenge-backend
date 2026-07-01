import { test } from '@japa/runner'
import User from '#models/user'

test.group('Models | User', () => {
  test('should create a User instance with correct properties', ({ assert }) => {
    const user = new User(1, 'John Doe', 'johndoe', 'john@example.com')
    assert.equal(user.id, 1)
    assert.equal(user.name, 'John Doe')
    assert.equal(user.username, 'johndoe')
    assert.equal(user.email, 'john@example.com')
  })
})
