// 確認會員身分
const { MongoClient, url } = require('./mongodbConnect');

module.exports = (req, res) => {

    const data = req.body;
    const uid = data.uid;

    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db("chatroom");
        dbo.collection("member").find({ uid: uid }).toArray((err, result) => {
            if (err) throw err;
            const data = { status: "success", result: result };
            if (result && result.length > 0) {
                data.status = "success";
            } else {
                data.status = "error";
            }
            res.json(data);
            db.close();
        })
    })
}

