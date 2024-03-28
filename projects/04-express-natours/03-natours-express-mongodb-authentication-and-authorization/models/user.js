const mongoose = require("mongoose");
const validator = require("validator");

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

  photo: String,

  password: {
    type: String,
    required: [true, "password is required!"],
    minLength: [8, "password must be at least 8 characters"],
  },

  passwordConfirm: {
    type: String,
    required: [true, "password is required!"],
    minLength: [8, "password must be at least 8 characters"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
    },
  },
});

module.exports = mongoose.model("User", UserSchema);
