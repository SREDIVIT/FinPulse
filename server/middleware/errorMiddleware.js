export const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === 'MongooseError' && err.message.includes('buffering timed out')) {
    statusCode = 503;
    message = 'MongoDB Service Unavailable: Database is disconnected. Please ensure MongoDB is running or configure MONGO_URI in server/.env.';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource ID: ${err.value}`;
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'A duplicate entry already exists with these unique values.';
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
