const weibo = require('./weibo')
const FFWeb = require('./FFWeb')
module.exports.name = 'shasha-subscribe'
module.exports.apply = (ctx) => {
  ctx.on("connect", () => {
    // weibo(ctx);
    FFWeb(ctx);
  });

}