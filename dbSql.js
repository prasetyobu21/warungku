const mysql = require("mysql");

exports.conn = mysql.createConnection({
  // connectionLimit: 100,
  host: "localhost",
  user: "root",
  password: "",
  database: "warungku",
  port: "3306"
  // multipleStatement: true
});
