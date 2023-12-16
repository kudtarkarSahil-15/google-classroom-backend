const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  enrollClasses: [
    {
      classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "classroom",
      },
    },
  ],
});

module.exports = mongoose.model("user", UserSchema);
