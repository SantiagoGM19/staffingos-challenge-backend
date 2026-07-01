import { test } from '@japa/runner'
import InvalidTokenException from '#exceptions/invalid_token_exception'
import InvalidCredentialsException from '#exceptions/invalid_credentials_exception'
import ExternalServiceNetworkException from '#exceptions/external_service_network_exception'
import ExternalServiceHttpException from '#exceptions/external_service_http_exception'
import ApplicationException from '#exceptions/application_exception'

test.group('Exceptions', () => {
  test('InvalidTokenException should have 401 status', ({ assert }) => {
    const error = new InvalidTokenException()
    assert.equal(error.status, 401)
    assert.equal(error.message, 'The provided token is invalid or has expired')
  })

  test('InvalidCredentialsException should have 401 status', ({ assert }) => {
    const error = new InvalidCredentialsException()
    assert.equal(error.status, 401)
    assert.equal(error.message, 'Invalid email or password provided')
  })

  test('ExternalServiceNetworkException should have 502 status', ({ assert }) => {
    const error = new ExternalServiceNetworkException()
    assert.equal(error.status, 502)
    assert.equal(error.message, 'Network error while communicating with an external service')
  })

  test('ExternalServiceHttpException should have default 502 status', ({ assert }) => {
    const error = new ExternalServiceHttpException()
    assert.equal(error.status, 502)
    assert.equal(error.message, 'External service returned an HTTP error')
  })

  test('ApplicationException should have default 500 status', ({ assert }) => {
    const error = new ApplicationException()
    assert.equal(error.status, 500)
    assert.equal(error.message, 'An unexpected error occurred. Please try again later.')
  })
})
