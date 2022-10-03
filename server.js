'use strict';

const net = require('net');
const { ChatRooms } = require('./rooms');
const { writeToSockets } = require('./tools');

const maxRooms = 5;
const rooms = new ChatRooms().create(maxRooms);
const sockets = new Set();

const onError = (err) => {
    console.log('Socket error: ', err);
};

// warning
const onEnd = (ip) => {
    sockets.delete(ip);
};

const onData = (socket, room, login, json) => {
    const message = JSON.parse(json);
    const { type, msg } = message;
    const msgToSocket = `${login}: ${msg}`;
    writeToSockets(msgToSocket, socket, rooms.getRoom(room));
};

// need create abstraction, which contain user data with connected room, login
const enterToRoom = (socket, login, json) => {
    const message = JSON.parse(json);
    const { roomID } = message;
    rooms.addToRoom(socket, roomID, login);
    const info = 'Your connected in the room!';
    socket.write(JSON.stringify({ type: 'inRoom' }));
    //socket.write(JSON.stringify({ type: 'info', info }));
    socket.on('data', onData.bind(null, socket, roomID, login));
};

const onLogin = (socket, json) => {
    const message = JSON.parse(json);
    const { login, password } = message;
    if (login && password) {
        sockets.add({ login, password, socket });
        const info = `Hi ${login}, you are connectred!\n
            Please, choose a room:)\n
            Available roomms: from 1 to ${maxRooms}
        `;
        socket.write(JSON.stringify({ type: 'onServer' }));
        //socket.write(JSON.stringify({ type: 'info', info }));
        //socket.write(JSON.stringify({ type: 'toRoom', maxRooms }));
        socket.once('data', enterToRoom.bind(null, socket, login));
    } else {
        const info = 'Wrong login or password';
        socket.write(JSON.stringify({ type: 'info', info }));
        socket.once('data', () => onLogin.bind(null, socket));
    }
};

const onConnection = (socket) => {
    socket.setEncoding('utf8');
    socket.once('data', onLogin.bind(null, socket));
    socket.on('error', onError);
    socket.on('end', onEnd);
};

const server = net.createServer(onConnection);

server.on('error', (err) => {
    console.log(err);
});

server.listen(2000);
console.log('Server started!');
