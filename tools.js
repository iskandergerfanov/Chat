'use strict';

const writeToSockets = (msg, sender, recievers) => {
    const i = JSON.stringify({ 'type': 'msg', msg });
    recievers.forEach((socket) => {
        if (socket !== sender)
            socket.write(i);
    });
};

const mutableStream = (stream) => {
  const mutable = {
    muted: false,
    mute() {
      this.muted = true;
    },
    unmute() {
      this.muted = false;
      stream.write('\n');
    },
    write(chunk, encoding, cb) {
      if (this.muted) return;
      stream.write(chunk, encoding, cb);
    },
  };
  Object.setPrototypeOf(mutable, stream);
  return mutable;
};

module.exports = { mutableStream, writeToSockets };
