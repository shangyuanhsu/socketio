const express = require('express');
const cors = require('cors');
var app = express();
const getMember = require('./getMember.js');
const getMsgLog = require('./getMsgLog.js');
const getRoomIdData = require('./getRoomIdData.js');
const insertMsg = require('./insertMsg.js');


app.use(cors()) // 跨域問題
app.use(express.json())// json格式

// 確認會員身分
app.post('/getMember',getMember);
// 抓使用者擁有的聊天室
app.post('/getMsgLog',getMsgLog);
// 抓預選的聊天室內容 => 之後要切分成不同數量與筆數
app.post('/getRoomIdData', getRoomIdData);
// 寫入留言
app.post('/insertMsg', insertMsg);

// server連線
app.listen(4000, function () {
    console.log('port 4000')
})