// 抓使用者擁有的聊天室
import moment from "moment";
import { query } from "./conbook";

export default function (req, res) {

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
                img: "",
                createtime: ""
            };
            const sql2 = `SELECT *
                          FROM chatroom.msglog
                          WHERE roomId = ?
                          order by msgId desc
                          limit 1`;
            query(sql2, [result.roomId], function (err, result2) {
                tem.roomId = result.roomId;
                if (result2.length > 0) {
                    tem.msg = result2[0].msgContent;
                    tem.msgId = result2[0].msgId;
                    tem.createtime = moment(result2[0].createtime).fromNow().split("days").length > 1 || moment(result2[0].createtime).fromNow().split("year").length > 1 ? moment(result2[0].createtime).format("MMM Do YY") : moment(result2[0].createtime).fromNow();
                }

            })
            const sql3 = `SELECT *
                          FROM chatroom.userroom
                          JOIN chatroom.member on member.uid = userroom.uid
                          JOIN chatroom.room on room.roomId = userroom.roomId
                          WHERE userroom.roomId = ?
                          AND userroom.uid != ?;`;
            query(sql3, [result.roomId, data.uid], function (err, result2) {
                if (result2.length > 0) {
                    tem.cusId = result2[0].uid;
                    tem.img = result2[0].img;
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
    query(sql, [uid], async (err, result) => {
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
}

