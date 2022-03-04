const http = require('http').Server();
const io = require("socket.io")(http, {
    cors: {
        origin: "*"
    }
});
const port = process.env.PORT || 3000;

const users = [];

function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

io.on('connection', (socket) => {
    // 聊天室的小房間
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        console.log("a", user.room);
        socket.join(user.room);


        // 傳訊息要互丟的資訊
        socket.on('chatMessage', (id, name, msg, time) => {
            console.log("b", user.room);
            io.to(user.room).emit('chatMessage', id, name, msg, time);
            console.log(socket.id);
            console.log(msg);
        });
    });


    socket.on('disconnect', () => {
        userLeave(socket.id);
    });

});

http.listen(port, () => {
    console.log(`listening on *:${port}`);
});

