const express = require("express");
const router = express.Router();

const {
  createClass,
  fetchAllClasses,
  createAssignment,
  deleteClassRoom,
  deleteAssignment,
  updateAssignment,
  updateClassroom,
  assignMarksToStudent,
} = require("../controllers/teacher.controller");

const userAuthentication = require("../middlewares/userauth");

router.route("/create").post(userAuthentication, createClass)

router.route("/").get(fetchAllClasses)

router.route("/assignment/:id").put(userAuthentication, createAssignment)

router.route("/update_assignment").put(userAuthentication, updateAssignment)

router.route("/delete_assignment").put(userAuthentication, deleteAssignment)

router.route("/:id").put(userAuthentication, updateClassroom)

router.route("/:id").delete(userAuthentication, deleteClassRoom)

router.route('/marks/:id').put(userAuthentication, assignMarksToStudent)

module.exports = router;
