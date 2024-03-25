const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("./CustomErrorAPI");

class UnAuthorizedError extends CustomErrorAPI {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnAuthorizedError;
