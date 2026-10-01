// Middleware to handle 404 Not Found for non-existing endpoints
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Centralized error handler middleware
const errorHandler = (err, req, res, next) => {
  // Use existing status code if set, otherwise default to 500
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error'
  });
};

module.exports = {
  notFound,
  errorHandler
};
