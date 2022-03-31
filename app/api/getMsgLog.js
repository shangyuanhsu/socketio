// 抓使用者擁有的聊天室
const moment = require('moment');
const { MongoClient, url } = require('./conbook');

module.exports = function (req, res) {

    const data = req.body;
    const uid = data.uid;

    let dataTem = {
        status: "success",
        result: []
    };

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("chatroom");
        dbo.collection("userroom").find({ uid: uid }).sort({ updatetime: -1 }).toArray(async function (err, result) {
            if (err) throw err;
            console.log(result);
          
            function a(){
                return new Promise((resolve) => {
                    const arr = [];
                    for (let i = 0; i < result.length; i++) {
                        const tem =
                        {
                            roomId: result[i].roomId,
                            cusId: result[i].cusId,
                            name: result[i].cusName,
                            category:result[i].category,
                            msg: result[i].lastMsg,
                            status:result[i].process,
                            img:"img/user.png",
                            createtime:moment(result[i].updatetime).fromNow().split("days").length > 1 || moment(result[i].updatetime).fromNow().split("year").length > 1 ? moment(result[i].updatetime).format("MMM Do YY") : moment(result[i].updatetime).fromNow()
                        };
                        arr.push(tem);
                    }
                    resolve(arr);
                })
            }
            
            let d = await a();
            dataTem.result = d;
            res.json(dataTem);
            db.close();
        })
    })
}

