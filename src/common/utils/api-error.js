class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(mesaage = "Bad Request") {
    return new ApiError(400, mesaage);
  }

  static unauthorized(mesaage = "unauthorized") {
    return new ApiError(401, mesaage);
  }

  static conflit(mesaage = "Conflit - User already exists!") {
    return new ApiError(409, mesaage);
  }

  static forbedden(mesaage = "forbedden") {
    return new ApiError(412, mesaage);
  }

  static noFound(mesaage = "NotFound") {
    return new ApiError(404, mesaage);
  }
}

export default ApiError;
