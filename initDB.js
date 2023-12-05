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
}

createTables();

// const createTables = `CREATE TABLE IF NOT EXISTS teacher (id INT PRIMARY KEY AUTO_INCREMENT, name TEXT);
// CREATE TABLE IF NOT EXISTS course (id INT PRIMARY KEY AUTO_INCREMENT, name TEXT);
// CREATE TABLE IF NOT EXISTS student (id INT PRIMARY KEY AUTO_INCREMENT, name TEXT);
// CREATE TABLE IF NOT EXISTS student_course(student_id INT NOT NULL, course_id INT NOT NULL, PRIMARY KEY (student_id, course_id));
// CREATE TABLE IF NOT EXISTS teacher_course(teacher_id INT NOT NULL, course_id INT NOT NULL, PRIMARY KEY (teacher_id, course_id));`;

// const studentValues = [["eli"], ["eyal"], ["shir"], ["tal"], ["shoham"]];
// const teacherValues = [
//   ["rachel"],
//   ["bracha"],
//   ["shlomo"],
//   ["shafran"],
//   ["tehila"],
// ];

// const courseValues = [["java"], ["js"], ["c"], ["c#"], ["python"]];

// const courseTeacherValues = [
//   [1, 1],
//   [1, 2],
//   [2, 1],
//   [3, 4],
//   [2, 4],
// ];

// const courseStudentValues = [
//   [1, 1],
//   [1, 2],
//   [2, 1],
//   [3, 4],
//   [2, 4],
// ];

// const insertStudentValues = "INSERT INTO student (name) VALUES ?;";
// const insertTeacherValues = "INSERT INTO teacher (name) VALUES ?;";
// const insertCourseValues = "INSERT INTO course (name) VALUES ?;";
// const insertCourseTeacherValues = "INSERT INTO student_course VALUES ?;";
// const insertCourseStudentValues = "INSERT INTO teacher_course VALUES ?;";

// const joinTables = `SELECT course.name AS course_name, teacher.name AS teacher_name, student.name AS student_name
// FROM course
// INNER JOIN student_course
// ON course.id = student_course.course_id
// INNER JOIN student
// ON student.id = student_course.student_id
// INNER JOIN teacher_course
// ON teacher_course.course_id = student_course.course_id
// INNER JOIN teacher
// ON teacher.id = teacher_course.teacher_id;`;

// executeQuery(createTables);
// executeQuery(insertStudentValues, [studentValues]);
// executeQuery(insertTeacherValues, [teacherValues]);
// executeQuery(insertCourseValues, [courseValues]);
// executeQuery(insertCourseTeacherValues, [courseTeacherValues]);
// executeQuery(insertCourseStudentValues, [courseStudentValues]);
// executeQuery(joinTables);
