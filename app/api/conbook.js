//mysql 連線
import { createConnection } from 'mysql';
var con = createConnection({
    host: "localhost",
    user: "root",
    // port: 8889,
    password: "root",
    database: "chatroom"
});
con.connect(function (err) {
    if (err) throw err;
});

export default con;