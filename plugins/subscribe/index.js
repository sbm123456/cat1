const weibo = require('./weibo')
const FFWeb = require('./FFWeb')
const DingYue = require('./DingYue');
const weiboDel = require('./weiboDel');
const wbList = require('./wbList');
module.exports.name = 'shasha-subscribe'
module.exports.apply = (ctx) => {
  ctx.command('subscribe', '订阅功能')
  .shortcut('微博订阅', { prefix: true })

  ctx.command('subscribe/wb-add', 'weibo订阅')
  .shortcut('订阅', { fuzzy: true, prefix: true })
  .action((text) => DingYue(text))

  ctx.command('subscribe/wb-del', 'weibo订阅删除')
  .shortcut('退订', { fuzzy: true, prefix: true })
  .action((text) => weiboDel(text))

  ctx.command('subscribe/wb-list', 'weibo订阅列表')
  .shortcut('订阅列表', { prefix: true })
  .action(text => wbList(text))

  ctx.on("connect", () => {
    weibo(ctx);
    FFWeb(ctx);
  });
}