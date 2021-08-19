const drawCard = require('./draw-card')
const getWiki = require('./get-wiki')
const zhanbu = require('./zhanbu')

module.exports.name = 'ff-utils'
module.exports.apply = (ctx) => {
  ctx.on("connect", () => {
    zhanbu(ctx); // 每天八点机器人定时占卜自己
  });
  ctx.command('_ff14', 'FFXIV功能')

  ctx.command('_ff14/ff-cactpot', '仙人微彩')
    .shortcut('刮刮乐', { fuzzy: true, prefix: true })
    .action(() => '仙人微彩计算器 - http://super-aardvark.github.io/yuryu')
  
  ctx.command('_ff14/ff-draw', '抽一张占星卡')
  .shortcut('抽卡', { prefix: true })
  .action(drawCard)

  ctx.command('_ff14/占卜', '鲨鲨占卜')
  .shortcut('占卜', { prefix: true })
  .action(({ session }) => zhanbu(session))

  ctx.command('_ff14/ff-search <content>', '搜索Wiki')
  .alias('ff-s')
  .option('share', '-s 使用分享卡片发送结果（可能发不出来）')
  .shortcut('查wiki', { fuzzy: true, prefix: true })
  .action(({ options }, content) => getWiki(options, content))
}