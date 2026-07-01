import { test } from '@japa/runner'
import Post from '#models/post'

test.group('Models | Post', () => {
  test('should create a Post instance with explicit id', ({ assert }) => {
    const post = new Post('My Title', 'My Body', 10, 5)
    assert.equal(post.title, 'My Title')
    assert.equal(post.body, 'My Body')
    assert.equal(post.userId, 10)
    assert.equal(post.id, 5)
  })

  test('should default id to 0 if not provided', ({ assert }) => {
    const post = new Post('My Title', 'My Body', 10)
    assert.equal(post.id, 0)
  })
})
