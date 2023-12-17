const express = require("express");
const router = express.Router();

const userAuthentication = require("../middlewares/userauth");
const {
  enrollClass,
  unenrollClass,
  listOfUserEnrollClass,
  submitAssignment,
} = require("../controllers/student.controller");

router.route("/enroll").put(userAuthentication, enrollClass);

router.route("/unenroll").put(userAuthentication, unenrollClass);

router.route("/get").get(userAuthentication, listOfUserEnrollClass);

router.route("/assignment/:id").put(userAuthentication, submitAssignment);

module.exports = router;
