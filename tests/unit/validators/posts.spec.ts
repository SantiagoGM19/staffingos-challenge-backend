import { test } from '@japa/runner'
import { createAndUpdatePostValidator } from '#validators/posts'

test.group('Validators | Posts', () => {
  test('should validate correct post payload', async ({ assert }) => {
    const payload = { title: 'My Title', body: 'My Body', userId: 1 }
    const result = await createAndUpdatePostValidator.validate(payload)
    assert.deepEqual(result, payload)
  })

  test('should fail and use custom messages if title is missing', async ({ assert }) => {
    const payload = { body: 'My Body', userId: 1 }
    try {
      await createAndUpdatePostValidator.validate(payload)
      assert.fail('Should have thrown')
    } catch (error: any) {
      assert.exists(error.messages)
      assert.equal(error.messages[0].message, 'Title is required')
    }
  })

  test('should fail if userId is not a number', async ({ assert }) => {
    const payload = { title: 'My Title', body: 'My Body', userId: 'one' }
    try {
      await createAndUpdatePostValidator.validate(payload)
      assert.fail('Should have thrown')
    } catch (error: any) {
      assert.exists(error.messages)
      assert.equal(error.messages[0].message, 'User ID must be a number')
    }
  })
})
