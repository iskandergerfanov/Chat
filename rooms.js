'use strict';

class ChatRooms {
    constructor() {
        this.rooms = {};
        this.countRooms = undefined;
    }
    _isNotRoom(room) {
        return (!room || room > this.countRooms || room < 1);
    }
    create(count) {
        this.countRooms = count;
        for (let i = 1; i <= count; i++) {
            this.rooms[i] = new Set();
        }
        return this;
    }
    sendToRoom(socket, msg, room) {
        if (this._isNotRoom(room)) return;
        this.rooms[room].forEach((sckt) => {
            if (sckt !== socket) sckt.write(msg);
        });
    }
    addToRoom(socket, room) {
        if (this._isNotRoom(room)) return;
        if (!socket) return;
        this.rooms[room].add(socket);
    }
    deleteUser(socket, room) {
        this.rooms[room].delete(socket);
    }
    getRoom(room) {
        if (this._isNotRoom(room)) return;
        return this.rooms[room];
    }
}

module.exports = { ChatRooms };
