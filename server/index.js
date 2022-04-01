const http = require('http').Server();
const io = require("socket.io")(http, {
    cors: {
        origin: "*"
    }
});
const port = process.env.PORT || 3000;

const users = [];
const msgArr = {};

function userJoin(id, username, room) {
    console.log(username, room);
    const user = { id, username, room };
    let arr = users.filter(item => item.username == username && item.room == room);
    if (arr.length == 0 && username && room) {
        users.push(user);
    }
    // console.log(users);
    return user;
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    const room = users.filter(user => user.id === id);
    // console.log(room);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    if (room[0]) {
        const deleteroom = users.filter(user => user.room === room[0].room);
        // console.log(deleteroom)
        if (deleteroom.length < 2) {
            delete msgArr[room];
        }
    }

}


io.on('connection', (socket) => {
    // 想要做有新訊息用
    socket.on('checkedNewMsg', (uid) => {
        let obj = {};
        for (var i in msgArr) {
            const arr = msgArr[i].filter(x => x.userId == uid || x.cusId == uid);
            if (arr.length != 0) {
                obj[i] = arr.map(x => x);
            }
        }
        io.emit('checkedNewMsg', obj);
    });
    // 聊天室的小房間
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // 傳訊息要互丟的資訊
        socket.on('chatMessage', (id, cusId, name, msg, time) => {
            // console.log(id, cusId, name, msg, time);
            io.to(user.room).emit('chatMessage', id, cusId, name, msg, time);
            if (msgArr[user.room]) {
                msgArr[user.room].push({ userId: name, cusuid: cusId, txt: msg, time: time });
            } else {
                msgArr[user.room] = [];
                msgArr[user.room].push({ userId: name, cusuid: cusId, txt: msg, time: time });
            }
        });

    });
    // 離開聊天室
    socket.on('disconnect', () => {
        // console.log('disconnect')
        userLeave(socket.id);
    });

});




http.listen(port, () => {
    console.log(`listening on *:${port}`);
});

