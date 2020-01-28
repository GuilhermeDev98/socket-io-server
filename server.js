var express = require('express'),
    http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

const users = []

const parseOriginClient = origin => {
    return removePortAndHttp = origin.split(':')[1].replace('//', '').split('.').join('')
}

const addClientToRoom = (room, client) => {
    const ip = client.handshake.address
    const exists = users.find(value => value[1] == ip)
    if(exists) return;
    users.push([client.id, ip ])
    client.join(room)
    io.to(room).emit('join', client.id);
}

io.on("connection", function (client) {
    const room = parseOriginClient(client.handshake.headers.origin);
    addClientToRoom(room, client)

    client.on('sendChatMessage', payload => {
        io.to(room).emit('receiveChatMessage', {
            user: {
                name: payload.user
            },
            socket: client.id,
            msg : payload.msg
        });
    })
});

server.listen(process.env.PORT || 3000, () => console.log(`Rodando na Porta ${process.env.PORT || 3000}`))