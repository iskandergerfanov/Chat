'use strict';

const net = require('net');
const rl = require('./r1');

const socket = new net.Socket();

// login, onServer, inRoom;
let state = 'onLogin';
let maxRooms = 0;
let roomID = 1;

const onConnect = async () => {
  const login = await rl.getUserInfo('enter login');
  const password = await rl.getUserInfo('enter password');
  socket.write(JSON.stringify({ type: 'login', login, password }));
  rl.on('line', async (line) => {
    switch (state) {
      case 'onServer':
        roomID = await rl.getUserInfo('enter room id');
        if (roomID > maxRooms) {
          socket.write(JSON.stringify({ roomID }));
        } else {
          console.log('Wrong roomID');
        }
        break;
      case 'inRoom':
        socket.write(JSON.stringify({ type: 'msg', msg: line }));
        break;
    }
  });
};

socket.on('connect', async () => await onConnect());

socket.on('data', (json) => {
  const message = JSON.parse(json);
  const { type, msg } = message;

  switch (type) {
    case 'msg':
      console.log(msg);
      break;
    case 'info':
      console.log(message['info']);
      break;
    case 'toRoom':
      maxRooms = message['maxRooms'];
      break;
    case 'onServer':
        state = 'onServer';
        break;
    case 'inRoom':
        state = 'inRoom';
        break;
  }
});

socket.on('error', (err) => {
    console.log('Socket error: ', err);
	rl.close();
	socket.end();
});

socket.on('end', () => {
	console.log('Connection ended');
	rl.close();
	socket.end();
});

socket.connect({
  port: 2000,
  host: '127.0.0.1',
});
