/*global require,__dirname,console*/
const {resolve} = require('path')
, botConfig = require(resolve(__dirname, 'src'));

console.info('Bot is starting...');
botConfig.then(bot => {
  bot.startPolling();
  console.info('Bot is started...');
});
