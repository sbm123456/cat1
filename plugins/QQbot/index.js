const dianzan = require('./dianzan');

module.exports.name = 'shasha-QQBot';
module.exports.apply = (ctx) => {

  ctx.on("connect", () => {
    const bot = ctx.bots[0];
    dianzan(bot);
  });
}