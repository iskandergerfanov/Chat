'use strict';

const net = require('net');
const readline = require('readline');
const { mutableStream } = require('./tools');

const rl = readline.createInterface({
	input: process.stdin,
	output: mutableStream(process.stdout),
});

const socket = new net.Socket();

socket.on('connect', () => {
  rl.question('Enter your username: ', (username) => {
    if (username) socket.write(username);
    rl.on('line', (line) => {
        socket.write(line);
    });
  });
});

socket.on('data', (data) => {
  console.log(data.toString());
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
