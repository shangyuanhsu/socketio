const http = require('http').Server();
const io = require("socket.io")(http, {
    cors: {
        origin: "*"
    }
});
const port = process.env.PORT || 3000;


io.on('connection', (socket) => {
  
   
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        console.log(socket.id);
        console.log(msg);
    });
});

http.listen(port, () => {
    console.log(`listening on *:${port}`);
});

