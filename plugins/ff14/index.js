const drawCard = require('./draw-card')
const getWiki = require('./get-wiki')
const zhanbu = require('./zhanbu')
const shoulie = require('./shoulie')

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

  ctx.command('_ff14/ff-shoulie <content>', '查狩猎车')
  .shortcut('狩猎车', { fuzzy: true, prefix: true })
  .shortcut('狩猎', { fuzzy: true, prefix: true })
  .action((content) => shoulie(content))

  ctx.command('_ff14/ff-web', '国服官网')
  .shortcut('官网', { prefix: true })
  .shortcut('国服官网', { prefix: true })
  .action(() => '国服官网 - https://adsrff.web.sdo.com/web1/')

  ctx.command('_ff14/ff-zhaodai', '萌新招待')
  .shortcut('招待', { prefix: true })
  .shortcut('招待码', { prefix: true })
  .shortcut('萌新招待', { prefix: true })
  .action(() => '萌新招待 - https://actff1.web.sdo.com/20190315Zhaodai/index.html#/index')

  ctx.command('_ff14/ff-jifen', '积分商城')
  .shortcut('积分兑换', { prefix: true })
  .shortcut('积分', { prefix: true })
  .shortcut('积分商城', { prefix: true })
  .action(() => '积分商城 - https://actff1.web.sdo.com/20180707jifen/index.html#/home')

  ctx.command('_ff14/ff-goods', 'ff14商城')
  .shortcut('我要氪金', { prefix: true })
  .shortcut('氪金', { prefix: true })
  .shortcut('商城', { prefix: true })
  .shortcut('道具商城', { prefix: true })
  .action(() => 'ff14商城 - https://qu.sdo.com/game/1')
  
  ctx.command('_ff14/ff-liwu', '陆行鸟礼物站')
  .shortcut('陆行鸟礼物站', { prefix: true })
  .shortcut('礼物站', { prefix: true })
  .action(() => '陆行鸟礼物站 - http://ff.pay.sdo.com/DepositActivity/index.htm')

  ctx.command('_ff14/ff-time', 'ff14充值')
  .shortcut('我要充值', { prefix: true })
  .shortcut('充值', { prefix: true })
  .shortcut('氪点卡', { prefix: true })
  .shortcut('氪月卡', { prefix: true })
  .shortcut('点卡', { prefix: true })
  .shortcut('月卡', { prefix: true })
  .shortcut('充值时长', { prefix: true })
  .action(() => 'ff14充值 - https://pay.sdo.com/')
}