const BadRequestError = require("./BadRequestError"); // bad request - 500
const CustomErrorAPI = require("./CustomErrorAPI"); // custom - default 500
const NotFoundError = require("./NotFoundError"); //  not found - 400
const UnAuthorizedError = require("./UnAuthorizedError"); // unauthorized - 401

module.exports = {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
  CustomErrorAPI,
};
