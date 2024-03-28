const { StatusCodes } = require("http-status-codes");
const { CustomErrorAPI } = require("../errors");

/**** produces readable error message for duplicate database values during creation or update */
const handleDuplicateValuesErrorDB = (error) => {
  const keyValues = Object.entries(error.keyValue);
  const message = `Duplicate values detected! [${
    keyValues[0][0] + ": " + keyValues[0][1]
  }] already exists! Please enter another value.`;

  return new CustomErrorAPI(message);
};

/**** same as above but for invalid type casting... eg. ObjectID (_id) not being of the right format */
const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new CustomErrorAPI(message);
};

/**** also same but for validation errors */
const handleValidationErrorDB = (error) => {
  const message = Object.values(error.errors)
    .map((err) => `[${err.message}]`)
    .join(" !~~~~! ");
  return new CustomErrorAPI(`${error._message} => ${message}`);
};

/*** ERROR response for development */
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
      error,
    });
  }
};

/**** ERROR response for production */
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
      error,
    });
  }
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
  if (err.code && err.code === 11000)
    // duplicate values
    customError = handleDuplicateValuesErrorDB(err, next);
  if (err.name === "CastError") customError = handleCastErrorDB(err); // cast error
  if (err.name === "ValidationError")
    // validation error
    customError = handleValidationErrorDB(err);

  if (process.env.NODE_ENV === "production") {
    sendProduction(res, customError);
  } else if (process.env.NODE_ENV === "development") {
    sendDevelopment(res, customError);
  }
};

// export
module.exports = errorHandler;
