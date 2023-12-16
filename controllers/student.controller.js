const classroomModels = require("../models/classroom.models");
const userModels = require("../models/user.models");

const enrollClass = async (req, res) => {
  try {
    const { classCode } = req.body;

    if (!classCode) {
      return res.status(400).json({ message: "enter invalid class code" });
    }

    const findClass = await classroomModels.findById(classCode);

    if (!findClass) {
      return res.status(400).json({ message: "class not found..!!" });
    }

    if (
      findClass.enrolledstudents.some((student) =>
        student.studentId.equals(req.user._id)
      )
    ) {
      return res
        .status(400)
        .json({ message: "You already enrolled in this class" });
    }

    const findClassAndJoin = await classroomModels.findByIdAndUpdate(
      classCode,
      {
        $push: {
          enrolledstudents: { studentId: req.user._id },
        },
      },
      { new: true }
    );

    const userEnroll = await userModels.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          enrollClasses: { classId: classCode },
        },
      },
      { new: true }
    );

    res.status(200).json({
      findClassAndJoin,
      userEnroll,
      message: "successfully join classroom",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const unenrollClass = async (req, res) => {
  try {
    const { classCode } = req.body;

    if (!(req.user.role === "student")) {
      return res
        .status(400)
        .json({ message: "do not have access to unenroll class" });
    }

    if (!classCode) {
      return res.status(400).json({ message: "class not found" });
    }

    const findAndUnenrollClass = await classroomModels.findByIdAndUpdate(
      classCode,
      {
        $pull: {
          enrolledstudents: { studentId: req.user._id },
        },
      },
      { new: true }
    );

    const userUnenrollClass = await classroomModels.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          enrollClasses: { classId: classCode },
        },
      },
      { new: true }
    );

    res.status(200).json({
      findAndUnenrollClass,
      userUnenrollClass,
      message: "successfully unenroll class..!!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const listOfUserEnrollClass = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const myclassRooms = await userModels
      .findOne({ email: userEmail })
      .populate({
        path: "enrollClasses.classId",
        select: "_id classname subject section teacherid",
        populate: {
          path: "teacherid",
          select: "_id username email role",
        },
      });

    if (!myclassRooms) {
      return res.status(400).json({
        message: "enroll class not found or not enroll any class..!!",
      });
    }

    res.status(200).json({
      myclassRooms: myclassRooms.enrollClasses,
      message: "successfully get list of my enroll classes",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "server error" });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, content } = req.body;
    const classId = req.params.id;

    const isAcceptingSubmissions = await classroomModels.findOne({
      _id: classId,
      "assignments._id": assignmentId,
      "assignments.aceept_submission": true,
    });

    if (!isAcceptingSubmissions) {
      return res.status(400).json({ message: "Assignment does not accept submissions" });
    }

    const updatedClass = await classroomModels.findOneAndUpdate(
      { _id: classId, "assignments._id": assignmentId },
      {
        $push: {
          "assignments.$.submissions": {
            studentId: req.user._id,
            content: content,
          },
        },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ updatedClass, message: "Assignment successfully submitted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Server error" });
  }
};




module.exports = {
  enrollClass,
  unenrollClass,
  listOfUserEnrollClass,
  submitAssignment,
};
