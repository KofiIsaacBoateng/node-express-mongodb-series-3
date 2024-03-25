const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("./CustomErrorAPI");

class NotFoundError extends CustomErrorAPI {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
