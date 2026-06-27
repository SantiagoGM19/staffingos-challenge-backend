export class HttpUtils {
  /**
   * Extracts the raw token from an `Authorization: Bearer <token>` header.
   * Returns an empty string if the header is missing or malformed.
   */
  static extractBearerToken(authHeader: string | undefined): string {
    return (authHeader ?? '').replace(/^Bearer\s+/i, '')
  }
}
