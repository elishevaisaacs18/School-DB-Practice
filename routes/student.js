var express = require("express");
var router = express.Router();
var { executeQuery } = require("../dbUtils");

router.get("/", async function (req, res, next) {
  try {
    const result = await executeQuery("SELECT * FROM student");
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
