// 抓預選的聊天室內容 => 之後要切分成不同數量與筆數
const { MongoClient, url } = require('./mongodbConnect');

module.exports = (req, res) => {
    const data = req.body;
    const roomId = data.roomId;
    console.log(roomId);
    if (roomId && roomId!=0) {
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            var dbo = db.db("chatroom");
            dbo.collection("msglog").find({ roomId: roomId }).toArray((err, result) => {
                if (err) throw err;
                const data = { status: "success", result: [] };
                if (result && result.length > 0) {
                    let arrData = result;
                    data.status = "success";
                    data.result = arrData;
                } else {
                    data.status = "error";
                }
                res.json(data);
                db.close();
                
            })
        })
    }
}

