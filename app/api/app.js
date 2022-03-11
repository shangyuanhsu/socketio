var express = require('express');
var cors = require('cors');
var app = express();
var moment = require("moment");
app.use(cors()) // 跨域問題
app.use(express.json())// json格式

//mysql 連線
var mysql = require('mysql');
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


// 確認會員身分
app.post('/getMember', function (req, res) {

    const data = req.body;
    const uid = data.uid;
    const sql = `SELECT * 
                 FROM member 
                 WHERE uid = ? 
                 AND status = 0`;
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
app.post('/getMsgLog', (req, res) => {

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
                status: 0,
                msgId: 0,
                msgTime: ""
            };
            const sql2 = `SELECT *
                          FROM chatroom.msglog
                          WHERE roomId = ?
                          order by msgId desc
                          limit 1`;
            con.query(sql2, [result.roomId], function (err, result2) {
                tem.roomId = result.roomId;
                if (result2.length > 0) {
                    tem.msg = result2[0].msgContent;
                    tem.msgId = result2[0].msgId;
                    tem.msgTime = moment(result2[0].msgTime).fromNow().split("days").length > 1 || moment(result2[0].msgTime).fromNow().split("year").length > 1 ? moment(result2[0].msgTime).format("MMM Do YY") : moment(result2[0].msgTime).fromNow();
                }

            })
            const sql3 = `SELECT *
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
                    tem.category = result2[0].category;
                }
                resolve(tem);

            })
        })
    }


    const sql = `SELECT * 
                 FROM chatroom.room
                 WHERE roomId in (
                 SELECT roomId 
                 FROM chatroom.userroom 
                 WHERE uid = ?)`;
    con.query(sql, [uid], async (err, result) => {
        const asyncForEach = async (array, callback) => {
            for (let index = 0; index < array.length; index++) {
                let val = await callback(array[index]);
                dataTem.result[index] = val;
            }
        }
        const asyncSort = () => {
            return new Promise((resolve) => {
                dataTem.result.sort((a, b) => b.msgId - a.msgId);
                resolve();
            })
        }
        await asyncForEach(result, checkedMsg);
        await asyncSort();
        res.json(dataTem);
    });

});

// 抓預選的聊天室內容 => 之後要切分成不同數量與筆數
app.post('/getRoomIdData', (req, res) => {
    const data = req.body;
    const roomId = data.roomId;
    if (roomId) {
        const sql = `SELECT * 
                     FROM chatroom.msglog 
                     WHERE msglog.roomId = ?;`;
        con.query(sql, [roomId], async function (err, result) {
            const data = { status: "success", result: [] };
            const asyncForEach = (array) => {
                return new Promise((resolve) => {
                    let data = [];
                    let arr = [];

                    for (let index = 0; index < array.length; index++) {
                        let obj = {
                            date: "",
                            data: [],
                        };
                        const time = moment(array[index].msgTime).format("MMM Do YY");
                        if (arr.indexOf(time) === -1) {
                            arr.push(time)
                            obj.date = time;
                            data.push(obj);
                        }
                        for (let k = 0; k < data.length; k++) {
                            if (data[k].date === time) {
                                data[k].data.push(array[index])
                                data[k].data[data[k].data.length-1].msgTime =  moment(data[k].data[data[k].data.length-1].msgTime).format("LT")
                            }
                        }
                    }
                    resolve(data);
                })
            }
            if (result && result.length > 0) {
                let arrData = await asyncForEach(result);
                data.result = arrData;
                data.status = "success";
            } else {
                data.status = "error";
            }
            res.json(data);
        });
    }


})

// server連線
app.listen(4000, function () {
    console.log('port 4000')
})