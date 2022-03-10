var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors()) // 跨域問題
app.use(express.json())// json格式

//mysql 連線
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "chatroom"
});
con.connect(function (err) {
    if (err) throw err;
});


// 確認會員身分
app.post('/getMember', function (req, res) {
   
    const data = req.body;
    const uid = data.uid;
    const sql = 'SELECT * FROM member WHERE uid = ? and status = 0';
    con.query(sql, [uid], function (err, result) {
        const data = { status: "success", result: result };
        if (result && result.length > 0) {
            data.status = "success";
        } else {
            data.status = "error";
        }
        res.json(data);
    });
})

// 抓使用者擁有的聊天室
app.post('/getMsgLog', async function (req, res) {

    const eachFun = async (arr) => {
        arr.forEach((item) => {
            const tem =
            {
                roomId: 0,
                cusId: 0,
                name: "",
                category: 1,
                msg: "",
                status: 0
            };
            const sql2 = `
                    SELECT *
                    FROM chatroom.msglog
                    WHERE roomId = ?
                    order by msgId desc
                    limit 1`;
            con.query(sql2, [item.roomId], function (err, result) {
                console.log("b")
                tem.roomId = result[0].roomId;
                tem.msg = result[0].msgContent;
            })
            const sql3 = `
            SELECT *
            FROM chatroom.userroom
            JOIN chatroom.member on member.uid = userroom.uid
            JOIN chatroom.room on room.roomId = userroom.roomId
            WHERE userroom.roomId = ?
            AND userroom.uid != ?;`;
            con.query(sql3, [item.roomId, data.uid], function (err, result) {
                console.log("c")
                tem.cusId = result[0].uid;
                tem.name = result[0].name;
                tem.status = result[0].process;
                dataTem.result.push(tem);
            })
        })
    }

    const data = req.body;
    const uid = data.uid;

    let dataTem = {
        status: "success",
        result: []
    };

    const sql = `
    SELECT * 
    FROM chatroom.room
    WHERE roomId in (
    SELECT roomId 
    FROM chatroom.userroom 
    WHERE uid = ?)`;
    con.query(sql, [uid], async (err, result) => {
        console.log("a")
        await eachFun(result);
        console.log("d")
        console.log("e")
        res.json(dataTem);
    });
});


// server連線
app.listen(4000, function () {
    console.log('port 4000')
})