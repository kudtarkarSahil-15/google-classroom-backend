require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

// import routes
const userRoutes = require("./routes/user.routes");
const teacherRoutes = require("./routes/teacher.routes");
const studentRoutes = require("./routes/student.routes");

// middlewares
app.use("*", cors({
  origin: true,
  credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// port
const PORT = 5000 || process.env.PORT;

// connect db
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log(`database is connected`))
  .catch((e) => console.log("databased not connected: ", e));

// routes declared
app.use("/api/v1", userRoutes);
app.use("/api/v1/class", teacherRoutes);
app.use("/api/v1", studentRoutes);

// listen
app.listen(PORT, () => console.log(`server is running on ${PORT}`));
