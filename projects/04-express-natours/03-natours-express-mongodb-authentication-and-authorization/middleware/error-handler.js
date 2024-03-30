const { StatusCodes } = require("http-status-codes");
const { CustomErrorAPI } = require("../errors");

/**** produces readable error message for duplicate database values during creation or update */
const handleDuplicateValuesErrorDB = (error) => {
  const keyValues = Object.entries(error.keyValue);
  const message = `Duplicate values detected! [${
    keyValues[0][0] + ": " + keyValues[0][1]
  }] already exists! Please enter another value.`;

  const newErr = new CustomErrorAPI(message);
  newErr.statusCode = 400;

  return newErr;
};

/**** same as above but for invalid type casting... eg. ObjectID (_id) not being of the right format */
const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  const newErr = new CustomErrorAPI(message);
  newErr.statusCode = 400;

  return newErr;
};

/**** also same but for validation errors */
const handleValidationErrorDB = (error) => {
  const message = Object.values(error.errors)
    .map((err) => `[${err.message}]`)
    .join(" !~~~~! ");

  const newErr = new CustomErrorAPI(`${error._message} => ${message}`);
  newErr.statusCode = 400;

  return newErr;
};

/*** jwt error */
const handleJWTError = (error) => {
  const newErr = new CustomErrorAPI(`${error.name}: Please login`);
  newErr.statusCode = 401;

  return newErr;
};

/**** jwt expired error */
const handleJWTExpiredError = (error) => {
  const newErr = new CustomErrorAPI(`${error.name}: Please login again!`);
  newErr.statusCode = 401;

  return newErr;
};

/*** ERROR response for development */
const sendDevelopment = (res, error) => {
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    error: error,
    stack: error.stack,
  });
};

/**** ERROR response for production */
const sendProduction = (res, error) => {
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

/**** GLOBAL ERROR HANDLER */
const errorHandler = (err, req, res, next) => {
  // checks if error has already been defined in our custom error api
  if (err instanceof CustomErrorAPI) {
    if (process.env.NODE_ENV === "production") {
      sendProduction(res, err);
    } else if (process.env.NODE_ENV === "development") {
      sendDevelopment(res, err);
    }
  }

  // if the above doesn't work we make an inclusive error handler
  let customError = {
    ...err,
  };

  console.log("Error name: ", err.name);
  // duplicate values
  if (err.code && err.code === 11000)
    customError = handleDuplicateValuesErrorDB(err);

  // cast error
  if (err.name === "CastError") customError = handleCastErrorDB(err);

  // validation error
  if (err.name === "ValidationError")
    customError = handleValidationErrorDB(err);

  // jwt token error
  if (err.name === "JsonWebTokenError") {
    customError = handleJWTError(err);
  }
  // jwt expired error
  if (err.name === "TokenExpiredError") {
    customError = handleJWTExpiredError(err);
  }

  if (customError.isOperational) {
    if (process.env.NODE_ENV === "production") {
      sendProduction(res, customError);
    } else if (process.env.NODE_ENV === "development") {
      sendDevelopment(res, customError);
    }
  } else {
    console.log("ERROR: Not operational error");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong. Please try again!",
      error:
        process.env.NODE_ENV === "development"
          ? customError
          : "error isn't available during production",
      stack:
        process.env.NODE_ENV === "development"
          ? customError.stack
          : "stack isn't available during production",
    });
  }
};

// export
module.exports = errorHandler;
