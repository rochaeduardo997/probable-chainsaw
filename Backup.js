const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');

//GLOBAL
var getHostname = os.hostname();
var getDate = new Date().toISOString().slice(0, 10);

function mysqlBackup() {
  return new Promise((resolve, reject) => {
    try {
      let databaseHost = 'localhost';
      let databaseUsername = 'username';
      let databasePassword = 'password';
      let databaseName = 'database';

      let destinyDirectory = './sql-bkp/';

      let databaseBackupFilename = destinyDirectory + 'sql-bkp-' + getHostname + '-' + getDate + '.sql.bkp';

      if (fs.existsSync(destinyDirectory)) {
        if (!fs.existsSync(databaseBackupFilename)) {

          childProcess.exec(`mysqldump --single-transaction -h${databaseHost} -u${databaseUsername} -p${databasePassword} ${databaseName} > ${databaseBackupFilename}`, (error) => {
            if (!error) {
              resolve(console.log(`Database backup stored at file: ${databaseBackupFilename.split('./sql-bkp/').splice(1).toString()}`));
            } else {
              childProcess.exec(`rm -f ${databaseBackupFilename}`);
              // console.error(error);
              resolve(console.log(`Database communication failed, \n  Host:${databaseHost} User:${databaseUsername} Password:${databasePassword} Database:${databaseName}`));
            }
          });
        } else {
          resolve(console.log('Database - File already exists'));
        }
      } else {
        resolve(console.log('Database - Destiny directory doesn\'t exists'));
      }
    } catch (error) {
      reject(console.error('Catch - Failed backup database: ', error));
    }
  });
}

function directoryBackup() {
  return new Promise((resolve, reject) => {
    try {
      let fromDirectoryName = './fileOrDirectory';
      let destinyDirectory = './dir-bkp/';
      let toDirectoryName = (destinyDirectory + 'dir-bkp-' + getHostname + '-' + getDate + '.tar.gz');

      if (fs.existsSync(fromDirectoryName)) {
        if (!fs.existsSync(toDirectoryName)) {
          childProcess.exec(`tar -czf ${toDirectoryName} ${fromDirectoryName}`, (error) => {
            if (!error) {
              resolve(console.log(`Compression completed, file generated: ${toDirectoryName.split('./dir-bkp/').splice(1).toString()}`));
            } else {
              // console.error(error);
              resolve(console.log('Failed to compress directory'));
            }
          });
        } else {
          resolve(console.log('Directory - File already exists'));
        }
      } else {
        resolve(console.log(`Directory or file doesn\'t exists,\n  ${fromDirectoryName} cannot be found`));
      }
    } catch (error) {
      reject(console.error('Failed to compress directory: ', error));
    }
  });
}

module.exports = {
  mysqlBackup,
  directoryBackup,
};