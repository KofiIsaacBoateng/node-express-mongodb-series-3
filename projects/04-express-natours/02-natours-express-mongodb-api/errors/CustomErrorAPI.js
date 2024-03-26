const { StatusCodes } = require("http-status-codes");

class CustomErrorAPI extends Error {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomErrorAPI;
