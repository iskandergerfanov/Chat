'use strict';

const net = require('net');
const { ChatRooms } = require('./rooms');
const { User } = require('./user');
const { writeToSockets } = require('./tools');
const { colorer, randomColorer } = require('./colors');

const maxRooms = 5;
const rooms = new ChatRooms().create(maxRooms);
const sockets = new Set();

// very bad to processing, i can use replace
const notifications = {
    'ConnectedOnServer': (rooms) => colorer(`
        Hi, dier friend! You connected
        Now you need to choose the chat-room
        Chat-rooms available: 1 - ${rooms}
    `, 2),
    'CameIntoTheRoom': (room) => colorer(`
        Your connected in room_${room}!
    `, 2),
    'UserNotInRoom': colorer('You need choose the room', 1)
};

const onError = (err) => {
    console.log('Socket error: ', err);
};

// warning
const onEnd = (ip) => {
    sockets.delete(ip);
};

const onData = (user, json) => {
    const message = JSON.parse(json);
    const login = user.getLogin();
    const socket = user.getSocket();
    const { type, msg } = message;

    if (type === 'changeRoom') {
        const { room } = message;
        // maybe i need use reflection
        user.setRoom(room);
        rooms.deleteUser(socket, room);
        rooms.addToRoom(socket, room, login);
        const info = notifications['CameIntoTheRoom'](room);
        socket.write(JSON.stringify({ type: 'info', info }));
    } else if (type === 'msg') {
        // meh need fix spaghetti ifs
        const room = user.getRoom();
        if (room) {
            const colorfulLogin = user.getFunnyLogin();
            const msgToSocket = `${colorfulLogin}: ${msg}`;
            writeToSockets(msgToSocket, socket, rooms.getRoom(room));
        } else {
            const info = notifications['UserNotInRoom'];
            socket.write(JSON.stringify({ type: 'info', info }));
        }
    }
};

const onLogin = (socket, json) => {
    const message = JSON.parse(json);
    const { login, password } = message;
    // fix when db will added
    if (login && password) {
        const user = new User(login, socket, randomColorer(login));
        const info = notifications['ConnectedOnServer'](maxRooms);
        socket.write(JSON.stringify({ type: 'info', info }));
        sockets.add(user);
        socket.on('data', onData.bind(null, user));
    }
};

const onConnection = (socket) => {
    socket.setEncoding('utf8');
    socket.write(JSON.stringify({ type: 'forRoom', room: maxRooms }));
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
