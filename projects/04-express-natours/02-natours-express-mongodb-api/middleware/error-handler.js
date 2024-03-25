const { StatusCodes } = require("http-status-codes");
const { CustomErrorAPI } = require("../errors");

const errorHandler = (err, req, res, next) => {
  console.log(typeof CustomErrorAPI);
  if (err instanceof CustomErrorAPI) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return next();
  }

  const customError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "Something went wrong, please try again!",
  };

  res.status(customError.statusCode).json({
    success: false,
    message: customError.message,
  });
};

module.exports = errorHandler;
