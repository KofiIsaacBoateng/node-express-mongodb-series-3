const { StatusCodes } = require("http-status-codes");
const { CustomErrorAPI } = require("../errors");

const handleDuplicateValuesError = (error) => {
  const keyValues = Object.entries(error.keyValue);
  const message = `Duplicate values detected! [${
    keyValues[0][0] + ": " + keyValues[0][1]
  }] already exists!`;

  return new CustomErrorAPI(message);
};

const handleCastError = (error) => {
  const message = `Invalid input => ${error.path}: ${error.value}`;
  return new CustomErrorAPI(message);
};

const handleValidationError = (error) => {
  return new CustomErrorAPI(error.message);
};

const sendDevelopment = (res, error) => {
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    error: error,
    stack: error.stack,
  });
};

const sendProduction = (res, error) => {
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomErrorAPI) {
    console.log("came here");
    if (process.env.NODE_ENV === "production") {
      return sendProduction(res, err);
    } else if (process.env.NODE_ENV === "development") {
      return sendDevelopment(res, err);
    }
  }

  const customError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "Something went wrong, please try again!",
    error: err,
    stack: err.stack,
  };

  if (err.code && err.code === 11000) {
    const error = handleDuplicateValuesError(err, next);
    customError.message = error.message;
    customError.statusCode = error.statusCode;
  }

  if (err.name === "CastError") {
    const error = handleCastError(err);
    customError.message = error.message;
    customError.statusCode = error.statusCode;
  }

  if (err.name === "ValidationError") {
    const error = handleValidationError(err);
    customError.message = error.message;
    customError.statusCode = error.statusCode;
  }

  if (process.env.NODE_ENV === "production") {
    return sendProduction(res, customError);
  } else if (process.env.NODE_ENV === "development") {
    return sendDevelopment(res, customError);
  }
};

module.exports = errorHandler;
