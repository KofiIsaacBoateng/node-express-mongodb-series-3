const { StatusCodes } = require("http-status-codes");

class CustomErrorAPI extends Error {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    Error.captureStackTrace(this, this.stack);
  }
}

module.exports = CustomErrorAPI;
