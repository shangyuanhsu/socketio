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
    port: 8889,
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
app.post('/getMsgLog',  (req, res) => {

    const data = req.body;
    const uid = data.uid;

    let dataTem = {
        status: "success",
        result: []
    };
    const checkedMsg = (result) => {
        return new Promise((resolve) => {
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
            con.query(sql2, [result.roomId], function (err, result2) {
                tem.roomId = result.roomId;
                if (result2.length > 0) {
                    tem.msg = result2[0].msgContent;
                }

            })
            const sql3 = `
            SELECT *
            FROM chatroom.userroom
            JOIN chatroom.member on member.uid = userroom.uid
            JOIN chatroom.room on room.roomId = userroom.roomId
            WHERE userroom.roomId = ?
            AND userroom.uid != ?;`;
            con.query(sql3, [result.roomId, data.uid], function (err, result2) {
                if (result2.length > 0) {
                    tem.cusId = result2[0].uid;
                    tem.name = result2[0].name;
                    tem.status = result2[0].process;
                }
                resolve(tem);

            })
        })
    }

    const sql = `
    SELECT * 
    FROM chatroom.room
    WHERE roomId in (
    SELECT roomId 
    FROM chatroom.userroom 
    WHERE uid = ?)`;
    con.query(sql, [uid], async (err, result) => {
        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                let val = await callback(array[index]);
                dataTem.result[index] = val;
            }
        }
        await asyncForEach(result, checkedMsg)
        res.json(dataTem);
    });

});


// server連線
app.listen(4000, function () {
    console.log('port 4000')
})