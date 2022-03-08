var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors())
app.use(express.json())

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "chatroom"
});


app.post('/getMember', function (req, res) {
    const data = req.body;
    con.connect(function (err) {
        if (err) throw err;
        var uid = data.uid;
        var sql = 'SELECT * FROM member WHERE uid = ? and status = 0';
        con.query(sql, [uid], function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                res.json({ status: "success", result: result })
            } else {
                res.json({ status: "error", result: result })
            }
        });
    });

})

app.post('/test2', function (req, res) {
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM customers", function (err, result, fields) {
            if (err) throw err;
            res.json(result)
        });
    });

})

app.listen(4000, function () {
    console.log('port 4000')
})