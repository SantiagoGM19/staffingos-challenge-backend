export class ApiResponse {
  static success(data: any, message?: string) {
    return {
      status: 'success',
      ...(message ? { message } : {}),
      data
    }
  }

  static error(message: string, errors?: any) {
    return {
      status: 'error',
      message,
      ...(errors ? { errors } : {})
    }
  }
}
