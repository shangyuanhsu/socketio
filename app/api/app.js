import express, { json } from 'express';
import cors from 'cors';
var app = express();

import getMember from "./getMember.js";
import getMsgLog from "./getMsgLog.js";
import getRoomIdData from "./getRoomIdData.js";
app.use(cors()) // 跨域問題
app.use(json())// json格式

// 確認會員身分
app.post('/getMember',getMember);
// 抓使用者擁有的聊天室
app.post('/getMsgLog',getMsgLog);
// 抓預選的聊天室內容 => 之後要切分成不同數量與筆數
app.post('/getRoomIdData', getRoomIdData);

// server連線
app.listen(4000, function () {
    console.log('port 4000')
})