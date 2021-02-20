const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');

//GLOBAL
var getHostname = os.hostname();
var getDate = new Date().toISOString().slice(0, 10);
var getHour = new Date().toString().slice(16, 24);

async function main() {
  console.log('------------------------------------------------------------');
  console.log('Backup function started at', getDate, getHour, '\n');

  await Promise.all([
    mysqlBackup(),
    directoryBackup(),
  ]);

  let getDateFinishedAt = new Date().toISOString().slice(0, 10);
  let getHourFinishedAt = new Date().toString().slice(16, 24);
  console.log('\nBackup function finished at', getDateFinishedAt, getHourFinishedAt);
  console.log('------------------------------------------------------------');
}
main();

function mysqlBackup() {
  return new Promise((resolve, reject) => {
    try {
      let databaseUsername = 'dbUsername';
      let databasePassword = 'dbPassword';
      let databaseName = 'dbName';

      let destinyDirectory = './sql-bkp/';

      let databaseBackupFilename = destinyDirectory + 'sql-bkp-' + getHostname + '-' + getDate + '.sql.bkp';

      if (fs.existsSync(destinyDirectory)) {
        if (!fs.existsSync(databaseBackupFilename)) {

          childProcess.exec(`mysqldump --single-transaction -u${databaseUsername} -p${databasePassword} ${databaseName} > ${databaseBackupFilename}`, (error) => {
            if (!error) {
              resolve(console.log('Database backup stored at file:', databaseBackupFilename.split('./sql-bkp/').splice(1).toString()));
            } else {
              childProcess.exec(`rm -f ${databaseBackupFilename}`)
              resolve(console.error('Failed backup database: ', error));
            }
          });
        } else {
          resolve(console.error('Database - File already exists'));
        }
      } else {
        resolve(console.error('nDatabase - Destiny directory doesn\'t exists'));
      }
    } catch (error) {
      reject(console.error('Catch - Failed backup database: ', error));
    }
  });
}

function directoryBackup() {
  return new Promise((resolve, reject) => {
    try {
      let fromDirectoryName = './folderOrFile';
      let destinyDirectory = './dir-bkp/';
      let toDirectoryName = (destinyDirectory + 'dir-bkp-' + getHostname + '-' + getDate + '.tar.gz');

      if (fs.existsSync(fromDirectoryName)) {
        if (!fs.existsSync(toDirectoryName)) {
          childProcess.exec(`tar -czf ${toDirectoryName} ${fromDirectoryName}`, (error) => {
            if (!error) {
              resolve(console.log('Compression completed, file generated:', toDirectoryName.split('./dir-bkp/').splice(1).toString()));
            } else {
              resolve(console.error('Failed to compress directory: ', error));
            }
          });
        } else {
          resolve(console.log('Directory - File already exists'));
        }
      } else {
        resolve(console.log('Directory or file doesn\'t exists'));
      }
    } catch (error) {
      reject(console.error('Failed to compress directory: ', error));
    }
  });
}
