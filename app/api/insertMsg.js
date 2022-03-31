// 寫入訊息
const { MongoClient, url } = require('./mongodbConnect');

module.exports = (req, res) => {
    const data = req.body.data;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("chatroom");

        // 更新
        const updateMsg = () => {
            var newvalues = { $set: { data: data.data } };
            dbo.collection("msglog").updateOne({ date: data.date, roomId: data.roomId }, newvalues, function (err, result) {
                if (err) throw err;
                res.json({ status: "success",result:"updateMsg"});
                db.close();
            })
        }

        // 寫入
        const insertMsg = () => {
            dbo.collection("msglog").insertOne(data, function (err, result) {
                if (err) throw err;
                res.json({ status: "success",result:"insertMsg"});
                db.close();
            });
        }

        dbo.collection("msglog").findOne({ date: data.date,roomId: data.roomId }, function (err, result) {
            if (err) throw err;
            if (result) {
                updateMsg();
            } else {
                insertMsg();
            }
        })
    });
}