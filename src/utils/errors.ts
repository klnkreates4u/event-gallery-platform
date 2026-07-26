export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class StorageError extends AppError {
  constructor(message: string, statusCode = 500) {
    super(message, statusCode, 'STORAGE_ERROR');
  }
}

export class MediaError extends AppError {
  constructor(message: string, statusCode = 400) {
    super(message, statusCode, 'MEDIA_ERROR');
  }
}

export class AuthError extends AppError {
  constructor(message: string, statusCode = 401) {
    super(message, statusCode, 'AUTH_ERROR');
  }
}
