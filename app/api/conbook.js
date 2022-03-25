//mysql 連線
const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    // port: 8889,
    password: "root",
    database: "chatroom"
});
con.connect(function (err) {
    if (err) throw err;
});

module.exports = con;