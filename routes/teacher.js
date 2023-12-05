const express = require("express");
const Joi = require("joi");
const executeQuery = require("../dbUtils").executeQuery;
var router = express.Router();
const schema = Joi.object({
  teacher_name: Joi.string().alphanum().min(3).max(30).required(),
  teacher_password: Joi.string().alphanum().min(3).max(20).required(),
  email: Joi.string().email({ tlds: { allow: false } }),
});

const getAllQuery = `
select school_name, admin_name from school.school
JOIN school.admin
ON admin.school_id = school.id;
`;

router.post("/", async function (req, res, next) {
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send("Bad Schema");
  }
  const addSchoolQuery = `INSERT INTO school.teacher (teacher_name, teacher_password, email)
  VALUES ('${req.body.teacher_name}' , '${req.body.teacher_password}', '${req.body.email}')`;
  try {
    const data = await executeQuery(addSchoolQuery);
    res.send("Teacher Added");
  } catch {
    res.send("Error Adding Teacher");
  }
});

router.get("/", async function (req, res, next) {
  try {
    const data = await executeQuery(getAllQuery);
    res.send(data);
  } catch {
    res.send("Error Reading DB");
  }
});
module.exports = router;
