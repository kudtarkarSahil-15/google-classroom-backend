const mongoose = require("mongoose");


const AssignmentSchema = new mongoose.Schema(
    {
        title: String,
        instructions: String,
        marks: {
          type: Number,
          default: 100
        },
        aceept_submission: {
          type: Boolean,
          default: true,
        },
        duedate: {
          type: Date,
          default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        submissions: [
          {
              studentId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "user"
              },
              content: {
                type: String,
                require: true,
              },
              marks: {
                  type: Number,
                  default: 0
              }
          }
        ]
      },
)


const ClassroomSchema = new mongoose.Schema({
  classname: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  teacherid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  enrolledstudents: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  assignments: [AssignmentSchema],
});

module.exports = mongoose.model("classroom", ClassroomSchema);
