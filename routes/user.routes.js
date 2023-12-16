const express = require("express");
const router = express.Router();

const {
  loginController,
  registerController,
  logoutController,
  testRoute,
} = require("../controllers/user.controller");

router.route("/").get(testRoute)

router.route("/login").post(loginController);

router.route("/register").post(registerController);

router.route('/logout').get(logoutController)

module.exports = router;
