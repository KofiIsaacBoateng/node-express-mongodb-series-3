const path = require("path");
const fs = require("fs");
const User = require("../models/user");
const asyncWrapper = require("../utils/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const users = path.join(__dirname, "..", "dev-data", "data", "users.json"); // robust data with a lot more fields

/*** GET ALL USERS */
module.exports.getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find({});

  res.status(StatusCodes.OK).json({
    success: true,
    results: users.length,
    data: users,
  });
});

/**** UPDATE ME */
module.exports.updateMe = asyncWrapper(async (req, res) => {
  const { password, passwordConfirm, ...body } = req.body;

  if (password || passwordConfirm) {
    throw new BadRequestError(
      "Password cannot be reset over here. Please checkout [/update-password] route"
    );
  }

  const user = await User.findByIdAndUpdate(req.user._id, body, {
    runValidators: true,
    new: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: user,
  });
});

module.exports.deleteMe = asyncWrapper(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);

  res.status(StatusCodes.NO_CONTENT).json({
    success: true,
    message: "user deleted successfully",
  });
});

/*** DELETE ME */

/**** MAIN */
module.exports.getUser = (req, res) => {
  res.status(500).json({
    success: false,
    msg: "Sorry! route not defined yet",
  });
};

module.exports.createUser = (req, res) => {
  res.status(500).json({
    success: false,
    msg: "Sorry! route not defined yet",
  });
};

module.exports.updateUser = (req, res) => {
  res.status(500).json({
    success: false,
    msg: "Sorry! route not defined yet",
  });
};

module.exports.deleteUser = (req, res) => {
  res.status(500).json({
    success: false,
    msg: "Sorry! route not defined yet",
  });
};
