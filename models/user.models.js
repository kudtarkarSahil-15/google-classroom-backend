const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    minlength: [6, 'password length should be more than 6'],
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'teacher']
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
