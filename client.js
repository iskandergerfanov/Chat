'use strict';

const net = require('net');
const rl = require('./r1');

const socket = new net.Socket();

let maxRooms = 0;

const chain = (arg2) => (arg1) => {
  return arg1 < arg2;
};

// add @to-private
const onConnect = async () => {
  const login = await rl.getUserInfo('enter login');
  const password = await rl.getUserInfo('enter password');
  socket.write(JSON.stringify({ type: 'login', login, password }));
  rl.on('line', async (line) => {
    if (line.startsWith('/changeRoom')) {
      const room = await rl.getUserInfoCond('Enter room', chain(maxRooms));
      socket.write(JSON.stringify({ type: 'changeRoom',  room }));
    } else {
      socket.write(JSON.stringify({ type: 'msg', msg: line }));
    }
  });
};

socket.on('connect', async () => await onConnect());

// if it recieve format not like json it will broken
socket.on('data', (json) => {
  const message = JSON.parse(json);
  const { type, msg, room, info } = message;

  switch (type) {
    case 'msg':
      console.log(msg);
      break;
    case 'info':
      console.log(info);
      break;
    case 'forRoom':
      maxRooms = room;
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
