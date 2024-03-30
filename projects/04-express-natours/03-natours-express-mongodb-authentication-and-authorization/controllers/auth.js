const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnAuthorizedError,
  CustomErrorAPI,
} = require("../errors");
const asyncWrapper = require("../utils/asyncWrapper");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendEmail = require("../utils/sendMail");
const crypto = require("crypto");

const registerToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = asyncWrapper(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  /*** verify if inputs */
  if (!name || !email || !password || !passwordConfirm) {
    throw new BadRequestError(
      "name, email, password, or password confirm is missing"
    );
  }

  const exists = await User.findOne({ email });

  /**** verify if user already exists */
  if (exists) {
    throw new BadRequestError(
      `User with email: ${email} already exists. Please login if this is you`
    );
  }

  /*** create user account */
  const user = await User.create(req.body);

  /***** token section */
  const token = registerToken(user);

  /*** get rid of password in response */
  user.password = undefined;

  /*** response */
  res.status(StatusCodes.OK).json({
    success: true,
    token,
    data: user,
  });
});

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide your email and password!");
  }

  /*** verify email and password */
  const exists = await User.findOne({ email }).select("+password");
  console.log(exists);
  if (!exists) {
    throw new BadRequestError("Invalid email or password");
  }

  const passwordVerified = await exists.verifyPassword(
    password,
    exists.password
  );
  if (!passwordVerified) {
    throw new BadRequestError("Invalid email or password");
  }

  /***** token section */
  const token = registerToken(exists);

  /**** get rid of password */
  exists.password = undefined;

  /**** response */
  res.status(StatusCodes.OK).json({
    success: true,
    token,
    data: exists,
  });
});

/**** route protector => middleware  */
const routeProtector = asyncWrapper(async (req, res, next) => {
  const { authorization } = req.headers;

  /** verify if token format */
  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new UnAuthorizedError("Unauthorized request! Please login.");
  }

  const token = authorization.split(" ")[1];

  /**** verify token and decode it */
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  if (!decoded) {
    throw new UnAuthorizedError(
      "Unauthorized request! Token provide is invalid please login"
    );
  }

  const user = await User.findById({ _id: decoded.id });

  if (!user) {
    throw new UnAuthorizedError(
      "User doesn't exist anymore. Please login or signup to have access"
    );
  }

  const changedPasswordAfterToken = user.changedPasswordAfterToken(decoded.iat);

  if (changedPasswordAfterToken) {
    throw new UnAuthorizedError(
      "You changed password recently! Please login again!"
    );
  }

  /**** give access to user data */
  req.user = user;

  next();
});

/**** role restrictions */
const roleRestriction = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new CustomErrorAPI(
        "Unauthorized request! You are not allowed to perform this activity!"
      );
      error.statusCode = StatusCodes.FORBIDDEN;

      next(error);
    }

    next();
  };
};

/****** forgot password  ***/
const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }); // get user

  if (!user) {
    // verify if user exists
    throw new BadRequestError(
      `Email: ${email} is invalid. Please signup or login!`
    );
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const subject = "Password Reset Request";
  const message = `<h2>Forgot your password?</h1></br><p>Don't worry! Click on the link below to reset.</br><a href="${
    req.protocol
  }://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}">Click me</a></p>`;

  try {
    await sendEmail({ email, subject, message });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Email send successfully!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(error);
    throw new CustomErrorAPI("Error sending email. Try again later!");
  }
});

const resetPassword = asyncWrapper(async (req, res, next) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gte: Date.now() },
  });

  if (!user) {
    throw new UnAuthorizedError("Reset token is invalid or has expired!");
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();

  /***** token section */
  const loginToken = registerToken(user);

  /**** get rid of password */
  user.password = undefined;

  /**** response */
  res.status(StatusCodes.OK).json({
    success: true,
    token: loginToken,
    data: user,
  });
});

/*** exports */
module.exports = {
  signup,
  login,
  routeProtector,
  roleRestriction,
  forgotPassword,
  resetPassword,
};
