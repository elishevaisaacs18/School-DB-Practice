const { query } = require("express");
const mysql = require("mysql");
const fs = require("node:fs");
const path = require("path");

async function initDB() {
  const paths = await fs.promises.readdir(
    path.resolve(__dirname, "./entities")
  );
  paths.forEach(async (filePath) => {
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
    DROP TABLE IF EXISTS ${tableName}
    CREATE TABLE IF NOT EXISTS ${tableName}
    (${sql})`;
    console.log(query);
  });
}

initDB();
