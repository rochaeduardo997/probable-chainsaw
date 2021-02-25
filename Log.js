const fs = require('fs');
const util = require('util');

const Telegram = require('./Telegram');

async function catchLogStdout() {
  let logFileFull = fs.createWriteStream('./logs/full-log.txt', { flags: 'a+' });
  let logFileLastOne = fs.createWriteStream('./logs/last-log.txt', { flags: 'w' });
  let logStdout = process.stdout;

  await createFiles(logFileFull, logFileLastOne, logStdout);

  setTimeout(() => {
    Telegram.sendTelegramMessage();
  }, 50);
}

function createFiles(logFileFull, logFileLastOne, logStdout) {
  return new Promise((resolve, reject) => {
    try {
      console.log = (d) => {
        logFileFull.write(util.format(d) + '\n');
        logFileLastOne.write(util.format(d) + '\n');
        logStdout.write(util.format(d) + '\n');
      }

      resolve(console.log(''));
    } catch (error) {
      reject(console.error('Failed to write files: ', error));
    }
  });
};

module.exports = {
  catchLogStdout,
}