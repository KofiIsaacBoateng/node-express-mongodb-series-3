const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  deleteMe,
  updateMe,
} = require("../controllers/users");
const { routeProtector, updatePassword } = require("../controllers/auth");

// update password
router.route("/update-password").post(routeProtector, updatePassword);

// update and delete me
router.route("/update-me").patch(routeProtector, updateMe);
router.route("/delete-me").delete(routeProtector, deleteMe);

// main
router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
