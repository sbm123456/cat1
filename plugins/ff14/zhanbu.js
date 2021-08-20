const nodeSchedule = require("node-schedule");

module.exports = async (ctx) => {
  const bot = ctx.bots[0];
  console.log("|----定时占卜任务启动 每天八点触发----|");
  nodeSchedule.scheduleJob("0 0 8 * * *", () => {
    bot.sendMessage("815465250", "/占卜");
  })
}
