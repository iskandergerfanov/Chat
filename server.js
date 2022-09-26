'use strict';

const net = require('net');
const { ChatRooms } = require('./rooms');
const { writeToSockets } = require('./tools');

const rooms = new ChatRooms().create(5);
const sockets = new Set();

const onData = (socket, data) => {
    writeToSockets(data, socket, rooms.getRoom(1));
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
    rooms.addToRoom(socket, 1);
    writeToSockets(msg, socket, rooms.getRoom(1));

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
