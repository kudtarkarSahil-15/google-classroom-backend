const asyncHandler = require("express-async-handler");
const classroomModels = require("../models/classroom.models");

const createClass = asyncHandler(async (req, res) => {
  try {
    const { classname, section, subject } = req.body;

    if (!classname || !section || !subject) {
      return res.status(400).json({ message: "All Fields are Required..!!" });
    }

    if (!(req.user.role === "teacher")) {
      return res
        .status(400)
        .json({ message: "Only Teacher can create class..!!" });
    }

    const newClass = await classroomModels.create({
      classname,
      section,
      subject,
      teacherid: req.user._id,
      enrolledstudents: [],
    });

    res
      .status(200)
      .json({ newClass, message: "Class successfully created..!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

const fetchAllClasses = asyncHandler(async (_, res) => {
  try {
    const classes = await classroomModels
      .find({})
      .populate("enrolledstudents.studentId", "_id username email")
      .populate("assignments.submissions.studentId", "_id username email");

    res.status(200).json({ classes, message: "get list of all classes" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "server error" });
  }
});

const createAssignment = asyncHandler(async (req, res) => {
  try {
    const classId = req.params.id;
    const { title, instructions } = req.body;

    const myclass = await classroomModels.findById(classId);

    if (!myclass) {
      return res.status(400).json({ message: "Class not found..!!" });
    }

    const createAssignment = await classroomModels.findByIdAndUpdate(
      classId,
      {
        $push: {
          assignments: {
            title,
            instructions,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      createAssignment,
      message: "Assignment created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, message: "Server error" });
  }
});

const updateAssignment = asyncHandler(async (req, res) => {
  try {
    const { assignmentId, title, instructions } = req.body;

    if (!(req.user.role === "teacher")) {
      return res
        .status(400)
        .json({ message: "Only teachers can update assignments." });
    }

    const userid = req.user._id;

    const myclass = await classroomModels.findOne({ teacherid: userid });

    if (!myclass) {
      return res.status(400).json({ message: "Class not found." });
    }

    const updatedClass = await classroomModels.findOneAndUpdate(
      { _id: myclass._id, "assignments._id": assignmentId },
      {
        $set: {
          "assignments.$.title": title,
          "assignments.$.instructions": instructions,
        },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ updatedClass, message: "Assignment updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Server error" });
  }
});

const deleteAssignment = asyncHandler(async (req, res) => {
  try {
    const { assignmentId } = req.body;

    if (!(req.user.role === "teacher")) {
      return res
        .status(400)
        .json({ message: "Only teachers can delete assignments." });
    }

    const userid = req.user._id;

    const myclass = await classroomModels.findOne({ teacherid: userid });

    if (!myclass) {
      return res.status(400).json({ message: "Class not found." });
    }

    const updatedClass = await classroomModels.findByIdAndUpdate(
      myclass._id,
      {
        $pull: {
          assignments: { _id: assignmentId },
        },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ updatedClass, message: "Assignment deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Server error" });
  }
});

const updateClassroom = asyncHandler(async (req, res) => {
  try {
    const classId = req.params.id;

    const updateClassroom = await classroomModels.findByIdAndUpdate(
      classId,
      { $set: req.body },
      { new: true }
    );

    res
      .status(200)
      .json({ updateClassroom, message: "class is successfully updated..!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "server error" });
  }
});

const deleteClassRoom = asyncHandler(async (req, res) => {
  try {
    const classId = req.params.id;
    const myClass = await classroomModels.findById(classId);

    if (!myClass) {
      return res.status(400).json({ message: "class not found..!!" });
    }

    if (req.user.role !== "teacher") {
      return res
        .status(400)
        .json({ message: "do not have access to delete a class..!!" });
    }

    const deleteClass = await classroomModels.findByIdAndDelete(classId);
    res
      .status(200)
      .json({ deleteClass, message: "classroom successfully deleted..!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "server error" });
  }
});

const assignMarksToStudent = asyncHandler(async (req, res) => {
  try {
    const { id: classId } = req.params;
    const { assignmentId, studentId, marks } = req.body;

    const updatedClass = await classroomModels.findOneAndUpdate(
      { _id: classId, "assignments._id": assignmentId },
      { $set: { "assignments.$.submissions.$[elem].marks": marks } },
      { arrayFilters: [{ "elem.studentId": studentId }], new: true }
    );

    res
      .status(200)
      .json({ updatedClass, message: "Marks assigned successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Server error" });
  }
});

module.exports = {
  createClass,
  fetchAllClasses,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  updateClassroom,
  deleteClassRoom,
  assignMarksToStudent,
};
