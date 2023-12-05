var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var schoolRouter = require("./routes/school");
var classroomRouter = require("./routes/classroom");
var adminRouter = require("./routes/admin");
var teacherRouter = require("./routes/teacher");
var studentRouter = require("./routes/student");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/school", schoolRouter);
app.use("/classroom", classroomRouter);
app.use("/admin", adminRouter);
app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "z10mz10m",
  database: "school",
  multipleStatements: true,
});

module.exports = { app, con };
