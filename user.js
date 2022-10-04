'use strict';

class User {
    constructor(login, socket, funnyLogin, room = null, state = 'default') {
        this.login = login;
        this.socket = socket;
        this.room = room;
        this.state = state;
        this.funnyLogin = funnyLogin;
    }

    async saveMessage() {
        console.log('Saved"');
    }
    async sendMessage() {
        console.log('Send');
    }

    getLogin() {
        return this.login;
    }
    getSocket() {
        return this.socket;
    }
    getRoom() {
        return this.room;
    }
    setRoom(room) {
        this.room = room;
    }
    getFunnyLogin() {
        return this.funnyLogin;
    }
}

module.exports = { User };
