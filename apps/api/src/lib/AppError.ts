// A typed, HTTP-aware error. Throw this anywhere in a service/controller and
// the central error handler turns it into a clean JSON response — without
// leaking stack traces or internal details to the client.
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }

  static unauthorized(msg = "Not authenticated") {
    return new AppError(401, msg, "UNAUTHORIZED");
  }
  static forbidden(msg = "Not permitted") {
    return new AppError(403, msg, "FORBIDDEN");
  }
  static notFound(msg = "Not found") {
    return new AppError(404, msg, "NOT_FOUND");
  }
  static badRequest(msg = "Invalid request") {
    return new AppError(400, msg, "BAD_REQUEST");
  }
}
