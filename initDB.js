// const { query } = require("express");
const mysql = require("mysql");
const fs = require("node:fs");
const path = require("path");

async function initDB() {
  const queriesArr = [];
  const paths = await fs.promises.readdir(
    path.resolve(__dirname, "./entities")
  );
  for (const filePath of paths) {
    const tableName = filePath.split(".")[0];
    const file = await JSON.parse(
      await fs.promises.readFile(
        path.resolve(__dirname, "./entities/" + filePath),
        "utf-8"
      )
    ).columns;

    let sql = "";
    file.forEach((column, index) => {
      for (const columnAttribute in column) {
        if (columnAttribute === "name" || columnAttribute === "type") {
          sql += column[columnAttribute] + " ";
        } else {
          if (column[columnAttribute]) {
            sql += columnAttribute + " ";
          }
        }
      }
      if (index !== file.length - 1) {
        sql += ",";
      }
    });

    const query = `
      DROP TABLE IF EXISTS ${tableName};
      CREATE TABLE IF NOT EXISTS ${tableName} (${sql});
    `;

    queriesArr.push(query.trim());
  }

  return queriesArr;
}

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "z10mz10m",
  database: "school",
  multipleStatements: true,
});

function executeQuery(sql, values) {
  con.query(sql, values, function (err, result) {
    if (err) throw err;
    console.log("success");
  });
}
async function createTables() {
  const tableCreationQueries = await initDB();
  Array.from(tableCreationQueries).forEach((query) => {
    executeQuery(query);
  });
  con.end();
}

createTables();
