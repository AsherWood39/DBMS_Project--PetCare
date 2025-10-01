// Error handling middleware for the PetCare API

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error Stack:', err.stack);
  console.error('Error Details:', {
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
    timestamp: new Date().toISOString()
  });

  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';

  // MySQL/Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 400;
    if (err.message.includes('email')) {
      message = 'Email address already exists';
    } else {
      message = 'Duplicate entry found';
    }
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Referenced record does not exist';
  }

  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    statusCode = 500;
    message = 'Database access denied';
  }

  if (err.code === 'ECONNREFUSED') {
    statusCode = 500;
    message = 'Database connection failed';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    
    // Extract validation error details
    if (err.details) {
      message = err.details.map(detail => detail.message).join(', ');
    }
  }

  // Cast errors (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Custom application errors
  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size too large';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file upload';
  }

  // Network/timeout errors
  if (err.code === 'ETIMEDOUT') {
    statusCode = 408;
    message = 'Request timeout';
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
      details: {
        name: err.name,
        code: err.code,
        sqlMessage: err.sqlMessage,
        sqlState: err.sqlState,
        errno: err.errno
      }
    })
  });
};

// Async error wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error responses
export const errorResponses = {
  unauthorized: (message = 'Unauthorized access') => new AppError(message, 401),
  forbidden: (message = 'Access forbidden') => new AppError(message, 403),
  notFound: (message = 'Resource not found') => new AppError(message, 404),
  badRequest: (message = 'Bad request') => new AppError(message, 400),
  conflict: (message = 'Resource conflict') => new AppError(message, 409),
  validationError: (message = 'Validation failed') => new AppError(message, 400),
  internalError: (message = 'Internal server error') => new AppError(message, 500)
};
