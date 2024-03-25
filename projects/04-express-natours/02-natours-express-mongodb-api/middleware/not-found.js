const { StatusCodes } = require("http-status-codes");
module.exports = notFound = (req, res) =>
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Route: [${req.path}] not found!`,
  });
