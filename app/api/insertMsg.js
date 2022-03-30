const { MongoClient, url } = require('./mongodbConnect');

module.exports = (req, res) => {
    const data = req.body.data;
    console.log("===========", data);



    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("chatroom");

        const updateMsg = () => {
            var newvalues = { $set: { data: data.data } };
            dbo.collection("msglog").updateOne({ date: data.date, roomId: data.roomId }, newvalues, function (err, res) {
                if (err) throw err;
                db.close();
            })
        }

        const insertMsg = () => {
            dbo.collection("msglog").insertOne(data, function (err, res) {
                if (err) throw err;
                db.close();
            });
        }


        dbo.collection("msglog").findOne({ date: data.date }, function (err, res) {
            if (err) throw err;
            if (res) {
                updateMsg()
            } else {
                insertMsg()
            }
        })

    });
}