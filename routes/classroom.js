var express = require("express");
var router = express.Router();
const Joi = require("joi");
var { executeQuery } = require("../dbUtils");

router.get("/", async function (req, res, next) {
  try {
    const result = await executeQuery("SELECT * FROM classroom");
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const schema = Joi.object({
  grade: Joi.number().integer().min(0).max(100).required(),
  grade_index: Joi.number().integer().min(0).max(100).required(),
  teacher_id: Joi.number().integer().min(0).max(10000).required(),
});

router.get("/:classroomId", async function (req, res, next) {
  const classroomId = req.params.classroomId;
  const getClassroomTeacherQuery = `SELECT student.student_name, classroom.id  AS classroom_number, teacher.teacher_name 
FROM school.student
JOIN classroom
ON classroom.id = ${classroomId}
JOIN teacher 
ON teacher.id = classroom.teacher_id;`;
  try {
    const result = await executeQuery(getClassroomTeacherQuery);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/", async function (req, res, next) {
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send("Bad Schema");
  }
  const addClassroomQuery = `INSERT INTO school.classroom (grade, grade_index, teacher_id)
  VALUES ('${req.body.grade}' , '${req.body.grade_index}' , '${req.body.teacher_id}')`;
  try {
    const data = await executeQuery(addClassroomQuery);
    res.send("classroom Added");
  } catch {
    res.send("Error Adding classroom");
  }
});

module.exports = router;
