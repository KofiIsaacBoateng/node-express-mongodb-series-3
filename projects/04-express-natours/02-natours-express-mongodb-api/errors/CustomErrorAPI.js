const { StatusCodes } = require("http-status-codes");

class CustomErrorAPI extends Error {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.BAD_REQUEST;

    Error.captureStackTrace(this, this.stack);
  }
}

module.exports = CustomErrorAPI;
