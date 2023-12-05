var express = require("express");
var router = express.Router();
const Joi = require("joi");
var { executeQuery } = require("../dbUtils");

router.get("/", async function (req, res, next) {
  try {
    const result = await executeQuery("SELECT student_name FROM student");
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


const schema = Joi.object({
  student_name: Joi.string().alphanum().min(3).max(30).required(),
  student_password: Joi.string().alphanum().min(3).max(30).required(),
  classroom_id: Joi.number().integer().min(0).max(10000).required(),
});

router.post("/", async function (req, res, next) {
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send("Bad Schema");
  }
  const addStudentQuery = `INSERT INTO school.student (student_name, student_password, classroom_id)
  VALUES ('${req.body.student_name}' , '${req.body.student_password}' , '${req.body.classroom_id}')`;
  try {
    const data = await executeQuery(addStudentQuery);
    res.send("Student Added");
  } catch {
    res.send("Error Adding Student");
  }
});

module.exports = router;
