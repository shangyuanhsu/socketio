
// 確認會員身分
const con = require('./conbook');

module.exports = function (req, res) {

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
}

