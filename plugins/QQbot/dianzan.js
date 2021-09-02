const nodeSchedule = require("node-schedule");

module.exports = async (bot) => {
  const list = await bot.$getFriendList();
  console.log("好友点赞服务启动");
  for(let i = 0; i < list?.length || 0; ++i) {
    if (list[i].userId !== "2714324034") bot.$sendLike(list[i].userId.toString(), 10);
  }
  // nodeSchedule.scheduleJob(rule, () => {
    // botSendByWeiBo(bot)
  // })
}