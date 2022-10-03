'use strict';

class ChatRooms {
    constructor() {
        this.rooms = {};
        this.countRooms = undefined;
    }
    _isNotRoom(roomNum) {
        return (!roomNum || roomNum > this.countRooms || roomNum < 1);
    }
    create(count) {
        this.countRooms = count;
        for (let i = 1; i <= count; i++) {
            this.rooms[i] = new Set();
        }
        return this;
    }
    sendToRoom(socket, msg, roomNum) {
        if (this._isNotRoom(roomNum)) return;
        this.rooms[roomNum].forEach((sckt) => {
            if (sckt !== socket) sckt.write(msg);
        });
    }
    addToRoom(socket, roomNum) {
        if (this._isNotRoom(roomNum)) return;
        if (!socket) return;
        this.rooms[roomNum].add(socket);
    }
    getRoom(roomNum) {
        if (this._isNotRoom(roomNum)) return;
        return this.rooms[roomNum];
    }
}

module.exports = { ChatRooms };
