const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const UserModel = require("../models/user.models");

// testing purpose
const testRoute = asyncHandler(async (_, res) => {
  res.status(200).json("Google Classroom Server Running..!!");
});

const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "all fields are required..!!" });
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "user not found..!!" });
  }

  const isPassword = await bcrypt.compare(password, user.password);

  if (!isPassword) {
    return res.status(400).json({ message: "enter valid credentials..!!" });
  }

  const token = await jsonwebtoken.sign({ _id: user.id }, jwtSecretKey, {
    expiresIn: "10h",
  });

  // attach token to a response cookie
  res.cookie("jwtoken", token, {
    httpOnly: true,
    secure: false,
  });

  res.status(200).json({ user, message: "login successfully..!!" });
});

const registerController = asyncHandler(async (req, res) => {
  const { username, email, password, confirmpassword, role } = req.body;

  if (!username || !email || !password || !confirmpassword || !role) {
    return res.status(400).json({ message: "all fields are required..!!" });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({ message: "password does not match..!!" });
  }

  if (!email.includes("@gmail.com")) {
    return res.status(400).json({ message: "email address is not valid" });
  }

  const hashpassword = await bcrypt.hash(password, 10);

  const createUser = await UserModel.create({
    username,
    email,
    password: hashpassword,
    role,
  });

  res.status(200).json({ createUser, message: "created user successfully" });
});

const logoutController = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie("jwtoken", { path: "/" })
    .json({ message: "successfully logout..!!" });
});

module.exports = {
  testRoute,
  loginController,
  registerController,
  logoutController,
};
