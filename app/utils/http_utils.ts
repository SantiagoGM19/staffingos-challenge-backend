export class HttpUtils {
  static extractBearerToken(authHeader: string | undefined): string {
    return (authHeader ?? '').replace(/^Bearer\s+/i, '')
  }
}
