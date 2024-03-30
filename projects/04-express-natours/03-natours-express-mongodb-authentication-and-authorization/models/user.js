const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: [3, "name is too short! Must be at least 3 characters"],
    maxLength: [50, "name is too long! Must not be more than 50 characters"],
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Email is required!"],
    validate: [validator.isEmail, "Invalid email!"],
  },

  roles: {
    type: String,
    required: true,
    enum: {
      values: ["admin", "lead-guide", "guide", "user"],
      message: "({VALUE}) is an invalid role!",
    },
    default: "user",
  },

  photo: String,

  password: {
    type: String,
    required: [true, "password is required!"],
    minLength: [8, "password must be at least 8 characters"],
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "password is required!"],
    minLength: [8, "password must be at least 8 characters"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Password must be equal to confirm password",
    },
  },

  passwordUpdatedAt: Date,
});

/*** pre-save hooks */
UserSchema.pre("save", async function (next) {
  // encrypt password and get rid of passwordConfirm
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password" || this.isNew)) return next();

  this.passwordUpdatedAt = Date.now();
  next();
});

/**** model interface methods */
UserSchema.methods.verifyPassword = async function (
  candidatePassword,
  dbPassword
) {
  return await bcrypt.compare(candidatePassword, dbPassword);
};

UserSchema.methods.changedPasswordAfterToken = function (tokenTimeStamp) {
  /**** covert jwt timestamp to seconds */
  if (this.passwordUpdatedAt) {
    const passwordTime = parseInt(this.passwordUpdatedAt.getTime() / 1000, 10);
    return tokenTimeStamp < passwordTime;
  }

  // password hasn't been changed
  return false;
};

module.exports = mongoose.model("User", UserSchema);
