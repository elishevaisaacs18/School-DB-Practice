const mysql = require("mysql");
const con = require("./app").con;

function executeQuery(sql, values = []) {
  con.query(sql, values, function (err, result) {
    if (err) console.err(err);
    return result;
  });
}

module.exports = executeQuery;
