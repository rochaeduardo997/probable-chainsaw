const fs = require('fs');
const https = require('https');

function sendTelegramMessage() {
  let token = '';
  let chatID = '';

  let messageBody = fs.readFileSync('./logs/last-log.txt', 'utf-8', function (err, data) {
    if (err) throw err;
    return data;
  });

  let api = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatID}&text=${messageBody}`;

  https.get(api, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Telegram\'s API has been accessed\n\n');
    });
  }).on("error", (error) => {
    console.log('Error: ' + error.message);
  });
}

module.exports = {
  sendTelegramMessage,
}