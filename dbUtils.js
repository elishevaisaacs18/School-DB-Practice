const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "z10mz10m",
  database: "school",
  multipleStatements: true,
});


function executeQuery(sql, values = []) {
  con.query(sql, values, function (err, result) {
    if (err) console.err(err);
    console.log(result);
    return result;
  });
}

module.exports = { executeQuery };
