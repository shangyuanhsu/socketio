// 抓預選的聊天室內容 => 之後要切分成不同數量與筆數
import moment from "moment";
import { query } from "./conbook";

export default function (req, res) {
    const data = req.body;
    const roomId = data.roomId;
    if (roomId) {
        const sql = `SELECT * 
                     FROM chatroom.msglog 
                     WHERE msglog.roomId = ?;`;
        query(sql, [roomId], async function (err, result) {
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
        });
    }
}

