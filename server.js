'use strict';

const net = require('net');

const sockets = new Set();

const writeToAll = (msg, sender) => {
    sockets.forEach((socket) => {
        if (socket !== sender)
            socket.write(msg);
    });
};

const onData = (socket, data) => {
    writeToAll(data, socket);
};

const onError = (err) => {
    console.log('Socket error: ', err);
};

const onEnd = (ip) => {
    sockets.delete(ip);
};

const onConnection = (socket) => {
    const ip = socket.remoteAddress;
    const msg = `${ip} connected!`;
    sockets.add(socket);
    writeToAll(msg, socket);

    socket.setEncoding('utf8');
    socket.on('data', onData.bind(null, socket));
    socket.on('error', onError);
    socket.on('end', onEnd.bind(null, ip));
};

const server = net.createServer(onConnection);

server.on('error', (err) => {
    console.log(err);
});

server.listen(2000);
console.log('Server started!');
