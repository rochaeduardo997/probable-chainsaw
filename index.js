const childProcess = require('child_process');
const os = require('os');

//GLOBAL
var getHostname = os.hostname();
var getDateTime = new Date().toISOString().slice(0, 10);

async function main() {
  mysqlBackup();
  directoryBackup();
}
main();

function mysqlBackup() {
  return new Promise((resolve, reject) => {
    try {
      let databaseUsername = 'username-here';
      let databasePassword = 'password-here';
      let databaseName = 'database-here';

      let databaseBackupFilename = './sql-bkp/sql-bkp-' + getHostname + '-' + getDateTime + '.sql.bkp';

      console.log('Starting database backup of', databaseName);

      childProcess.exec(`mysqldump --single-transaction -u${databaseUsername} -p${databasePassword} ${databaseName} > ${databaseBackupFilename}`, (error) => {
          if (!error) {
            resolve(console.log('\nDatabase backup stored at file:', databaseBackupFilename.split('./sql-bkp/').splice(1).toString()));
          } else {
            reject(console.error('\nFailed backup database: ', error));
          }
      });
    } catch (error) {
      reject(console.error('\nFailed backup database: ', error));
    }
  });
}

function directoryBackup() {
  return new Promise((resolve, reject) => {
    try {
      let fromDirectoryName = './file-or-directory-here';
      let toDirectoryName = ('./dir-bkp/dir-bkp-' + getHostname + '-' + getDateTime + '.tar.gz');

      console.log('\nStarting compression of', fromDirectoryName);

      childProcess.exec(`tar -czf ${toDirectoryName} ${fromDirectoryName}`, (error) => {
        if (!error) {
          resolve(console.log('\nCompression completed, file generated:', toDirectoryName.split('./dir-bkp/').splice(1).toString()));
        } else {
          reject(console.error('\nFailed to compress directory: ', error));
        }
      });
    } catch (error) {
      reject(console.error('\nFailed to compress directory: ', error));
    }
  });
}
