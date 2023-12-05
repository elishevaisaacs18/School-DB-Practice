const express = require("express");
const Joi = require("joi");
const executeQuery = require("../dbUtils").executeQuery;
var router = express.Router();
const schema = Joi.object({
  teacher_name: Joi.string().alphanum().min(3).max(30).required(),
  teacher_password: Joi.string().alphanum().min(3).max(20).required(),
  email: Joi.string().email({ tlds: { allow: false } }),
});

router.post("/", async function (req, res, next) {
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send("Bad Schema");
  }
  const addTeacherQuery = `INSERT INTO school.teacher (teacher_name, teacher_password, email)
  VALUES ('${req.body.teacher_name}' , '${req.body.teacher_password}', '${req.body.email}')`;
  try {
    const data = await executeQuery(addTeacherQuery);
    res.send("Teacher Added");
  } catch {
    res.send("Error Adding Teacher");
  }
});

  module.exports = router;
