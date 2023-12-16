const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const UserModel = require("../models/user.models");

// testing purpose
const testRoute = async(req,res) => {
  try {
    res.status(200).json("Google Classroom Server Running..!!");
  } 
  catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All Fields are Required..!!" });
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
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const registerController = async (req, res) => {
  try {
    const { username, email, password, confirmpassword, role } = req.body;

    if (!username || !email || !password || !confirmpassword || !role) {
      return res.status(400).json({ message: "All Fields are Required..!!" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Password does not match..!!" });
    }

    if (!email.includes("@gmail.com")) {
      return res.status(400).json({ message: "Email Address is not valid" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const createUser = await UserModel.create({
      username,
      email,
      password: hashpassword,
      role,
    });

    res.status(200).json({ createUser, message: "created user successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const logoutController = async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("jwtoken", { path: "/" })
      .json({ message: "successfully logout..!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "server error" });
  }
};

module.exports = { testRoute, loginController, registerController, logoutController };
