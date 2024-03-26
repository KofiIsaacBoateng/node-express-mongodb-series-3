const { StatusCodes } = require("http-status-codes");
const { CustomErrorAPI } = require("../errors");

const handleDuplicateValuesErrorDB = (error) => {
  const keyValues = Object.entries(error.keyValue);
  const message = `Duplicate values detected! [${
    keyValues[0][0] + ": " + keyValues[0][1]
  }] already exists! Please enter another value.`;

  return new CustomErrorAPI(message);
};

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new CustomErrorAPI(message);
};

const handleValidationErrorDB = (error) => {
  const message = Object.values(error.errors)
    .map((err) => `[${err.message}]`)
    .join(" !~~~~! ");
  return new CustomErrorAPI(`${error._message} => ${message}`);
};

const sendDevelopment = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error,
      stack: error.stack,
    });
  } else {
    console.log("ERROR: Not operational error");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong. Please try again!",
    });
  }
};

const sendProduction = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  } else {
    console.log("ERROR: Not operational error");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong. Please try again!",
    });
  }
};

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomErrorAPI) {
    if (process.env.NODE_ENV === "production") {
      return sendProduction(res, err);
    } else if (process.env.NODE_ENV === "development") {
      return sendDevelopment(res, err);
    }
  }

  let customError = {
    ...err,
  };
  if (err.code && err.code === 11000)
    customError = handleDuplicateValuesErrorDB(err, next);
  if (err.name === "CastError") customError = handleCastErrorDB(err);
  if (err.name === "ValidationError")
    customError = handleValidationErrorDB(err);

  if (process.env.NODE_ENV === "production") {
    return sendProduction(res, customError);
  } else if (process.env.NODE_ENV === "development") {
    return sendDevelopment(res, customError);
  }
};

module.exports = errorHandler;
