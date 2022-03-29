// 抓預選的聊天室內容 => 之後要切分成不同數量與筆數
const moment = require('moment');
const { MongoClient, url } = require('./mongodbConnect');

module.exports = (req, res) => {
    const data = req.body;
    const roomId = data.roomId;
    if (roomId) {

        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            var dbo = db.db("chatroom");
            dbo.collection("msglog").find({ roomId: roomId }).toArray(async(err, result) => {
                if (err) throw err;

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
                            const time = moment(array[index].createtime).format("MMM Do YY");
                            if (arr.indexOf(time) === -1) {
                                arr.push(time)
                                obj.date = time;
                                data.push(obj);
                            }
                            for (let k = 0; k < data.length; k++) {
                                if (data[k].date === time) {
                                    data[k].data.push(array[index])
                                    data[k].data[data[k].data.length - 1].createtime = moment(data[k].data[data[k].data.length - 1].createtime).format("LT")
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

                db.close();
            })
        })



        // const sql = `SELECT * 
        //              FROM chatroom.msglog 
        //              WHERE msglog.roomId = ?;`;
        // con.query(sql, [roomId], async function (err, result) {
        //     const data = { status: "success", result: [] };
        //     const asyncForEach = (array) => {
        //         return new Promise((resolve) => {
        //             let data = [];
        //             let arr = [];

        //             for (let index = 0; index < array.length; index++) {
        //                 let obj = {
        //                     date: "",
        //                     data: [],
        //                 };
        //                 const time = moment(array[index].createtime).format("MMM Do YY");
        //                 if (arr.indexOf(time) === -1) {
        //                     arr.push(time)
        //                     obj.date = time;
        //                     data.push(obj);
        //                 }
        //                 for (let k = 0; k < data.length; k++) {
        //                     if (data[k].date === time) {
        //                         data[k].data.push(array[index])
        //                         data[k].data[data[k].data.length - 1].createtime = moment(data[k].data[data[k].data.length - 1].createtime).format("LT")
        //                     }
        //                 }
        //             }
        //             resolve(data);
        //         })
        //     }
        //     if (result && result.length > 0) {
        //         let arrData = await asyncForEach(result);
        //         data.result = arrData;
        //         data.status = "success";
        //     } else {
        //         data.status = "error";
        //     }
        //     res.json(data);
        // });
    }
}

