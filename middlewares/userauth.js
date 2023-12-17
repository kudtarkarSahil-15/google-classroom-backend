const asyncHandler = require("express-async-handler");
const jsonwebtoken = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const UserModel = require("../models/user.models");

const userAuthentication = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;

    if (!token) {
      return res
        .status(400)
        .json({ message: "No Token, Authorization Denied..!!" });
    }

    // verify token
    const verifyToken = jsonwebtoken.verify(token, jwtSecretKey);

    // verify with user
    const user = await UserModel.findOne({ _id: verifyToken._id });
    if (!user) {
      return res.status(400).json({ message: "user is unauthorized..!!" });
    }

    // attach token, for later use
    req.token = token
    req.user = user

    console.log("user is authorized");

    // call out next middleware
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = userAuthentication;
