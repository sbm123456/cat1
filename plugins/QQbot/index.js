const dianzan = require('./dianzan');

module.exports.name = 'shasha-QQbot';
module.exports.apply = (ctx) => {

  ctx.on("connect", () => {
    const bot = ctx.bots[0];
    dianzan(bot);
  });
}