const os = require('os');

const Backup = require('./Backup');
const Log = require('./Log');

//GLOBAL
var getDate = new Date().toISOString().slice(0, 10);
var getHour = new Date().toString().slice(16, 24);

async function main() {
  console.log(`-------Started at ${getDate} ${getHour}--------\n`);

  await Promise.all([
    Backup.mysqlBackup(),
    Backup.directoryBackup(),
  ]);

  let getDateFinishedAt = new Date().toISOString().slice(0, 10);
  let getHourFinishedAt = new Date().toString().slice(16, 24);

  console.log(`\n-------Finished at ${getDateFinishedAt} ${getHourFinishedAt}-------\n\n`);
}

Log.catchLogStdout();

main();
