const nodeSchedule = require("node-schedule");
const fs = require("fs");
const { s, Random } = require('koishi-core')
const { readFile } = require('fs/promises')

const days = async (bot) => {
  const list = JSON.parse(fs.readFileSync('store/day.json'))
  const toDay = new Date();
  const week = toDay.getDay();
  const year = toDay.getFullYear();
  const month = toDay.getMonth() + 1;
  const day = toDay.getDate();
  let str = `${year}年${month}月${day}日\n各位光呆早上好！`;
  const obj = {};
  let flag = false;
  let shasha = `top${Random.int(1,6)}`;
  for(let i = 0,len = list.length; i < len; ++i) {
    const { name, date, isOffDay } = list[i];
    const time = new Date(`${date} 0:0:0`);
    const yar = time.getFullYear();
    const mnth = time.getMonth() + 1;
    const dy = time.getDate();
    if (yar === year && mnth === month && day === dy) {
      flag = true;
      if (isOffDay) {
        str += `今天是${name}假期！鲨鲨祝您假日愉快！\n`;
        shasha = `top${Random.int(1, 6)}`;
      } else { str += `今日${name}调休，坚持住，快要放假了！\n`; shasha = `bottom${Random.int(1, 4)}`;}
    };
    if (isOffDay && toDay < time) {
      if(!obj[name]) {
        obj[name] = time.getTime();
      }
    }
  };
  if (flag) {
    if (week === 6) str += '部队今日有三级金蝶buff，记得做暖暖和刮仙人彩哦，鲨鲨祝你中一等奖！\n'
    if (week === 0) str += '部队今日开放三级经验buff，鲨鲨祝你打本必出货。\n';
  } else if (week === 6) {
    str += '今天周六，双休啦，部队今日有三级金蝶buff，记得做暖暖和刮仙人彩哦，鲨鲨祝你中一等奖！\n';
  } else if (week === 0) {
    str += '今天周日，休假啦，部队今日开放三级经验buff，鲨鲨祝你打本必出货，也别忘了出门走走嗷。\n'
  } else {
    str += `距离周末只有${6-week}天啦！\n`;
    shasha = `center${Random.int(1, 4)}`;
  };
  let str1 = "";
  Object.keys(obj).forEach(key => {
    const nowDay = new Date(`${year}-${month}-${day} 0:0:0`).getTime();
    const nextDay = (obj[key] - nowDay)/(1000*60*60*24);
    str1 += `距离${key}假期还有${nextDay}天\n`;
  })

  cardIcon = await readFile(`./plugins/ff14/assets/shasha/${shasha}.jpg`);
  bot.sendMessage("635246373", str + s('image', { url: `base64://${cardIcon.toString('base64')}` }) + str1);
}
module.exports = async (ctx) => {
  const bot = ctx.bots[0];
  console.log("|----定时占卜任务启动 每天八点触发----|");
  nodeSchedule.scheduleJob("0 0 8 * * *", () => {
    bot.sendMessage("815465250", "/占卜");
  })
  nodeSchedule.scheduleJob("0 0 9 * * *", () => {
    days(bot);
  })
}
