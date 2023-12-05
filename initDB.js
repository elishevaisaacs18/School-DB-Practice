// const { query } = require("express");
const mysql = require("mysql");
const fs = require("node:fs");
const path = require("path");
var { executeQuery } = require("./dbUtils");

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

async function createTables() {
  const addForeignKeysSQL = `ALTER TABLE student
ADD FOREIGN KEY (classroom_id) REFERENCES classroom(id);
ALTER TABLE admin
ADD FOREIGN KEY (school_id) REFERENCES school(id);
ALTER TABLE classroom
ADD FOREIGN KEY (teacher_id) REFERENCES teacher(id);`;
  const tableCreationQueries = await initDB();
  tableCreationQueries.forEach(async (query) => {
     await executeQuery(query);
     executeQuery(addForeignKeysSQL);
  });
  con.end();
}

createTables();
