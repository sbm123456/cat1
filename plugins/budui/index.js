const BuduiAdd = require('./BuduiAdd');
const BuduiAll = require('./BuduiAll');
module.exports.name = 'shasha-budui';
module.exports.apply = (ctx) => {
  ctx.command('shasha_budui')
  .shortcut('部队功能', { prefix: true })

  ctx.command('shasha_budui/budui-add', "角色添加")
  .shortcut('角色添加', { fuzzy: true, prefix: true })
  .action((text) => BuduiAdd(text))

  ctx.command('shasha_budui/budui-all', "查看所有角色")
  .shortcut('角色合集', { fuzzy: true, prefix: true })
  .action(text => BuduiAll(text, ctx))
}