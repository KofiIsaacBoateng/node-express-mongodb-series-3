const express = require("express");
const router = express.Router();
const {
  login,
  signup,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

router.route("/signup").post(signup);
router.route("/login").post(login);

router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").post(resetPassword);

module.exports = router;
