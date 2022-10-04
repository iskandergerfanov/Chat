'use strict';

const readline = require('readline');
const { promisify } = require('util');
const { mutableStream } = require('./tools');

const rl = readline.createInterface({
	input: process.stdin,
	output: mutableStream(process.stdout),
});

rl.question[promisify.custom] = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};


const account = {
    question: promisify(rl.question),
    async getUserInfo(str) {
        const info = await this.question(str);
        return (info) ? info : this.getUserInfo(str);
    },
    async getUserInfoCond(str, check) {
      const info = await this.question(str);
      return (check(info)) ? info : this.getUserInfoCond(str, check);
    }
};

Object.setPrototypeOf(account, rl);

module.exports = account;
