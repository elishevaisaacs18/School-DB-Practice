const mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "z10mz10m",
  database: "school",
  multipleStatements: true,
});

function executeQuery(sql, values = []) {
  return new Promise((resolve, reject) => {
    con.query(sql, values, function (err, result) {
      if (err) {
        throw new Error(err);
      } else {
        resolve(result);
        console.log("success");
      }
    });
  });
}

module.exports = { executeQuery };
