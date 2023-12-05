const express = require("express");
const Joi = require("joi");
const executeQuery = require("../dbUtils").executeQuery;
var router = express.Router();
const schema = Joi.object({
  school_name: Joi.string().alphanum().min(3).max(30).required(),
  school_code: Joi.number().integer().min(0).max(10000).required(),
});

const getSchoolAdminQuery = `
select school_name, admin_name from school.school
JOIN school.admin
ON admin.school_id = school.id;
`;

router.get("/manager", async function (req, res, next) {
  try {
    const data = await executeQuery(getSchoolAdminQuery);
    res.send(data);
  } catch {
    res.send("Error Reading DB");
  }
});

router.post("/", async function (req, res, next) {
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send("Bad Schema");
  }
  const addSchoolQuery = `INSERT INTO school.school (school_name, school_code)
  VALUES ('${req.body.school_name}' , '${req.body.school_code}')`;
  try {
    const data = await executeQuery(addSchoolQuery);
    res.send("School Added");
  } catch {
    res.send("Error Adding School");
  }
});

module.exports = router;
