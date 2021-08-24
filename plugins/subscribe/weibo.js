const nodeSchedule = require("node-schedule");
const puppeteer = require('puppeteer');
const {
  s
} = require('koishi-core')
const fs = require("fs");

const scrape = (lastTime, url, page) => {
  return new Promise(async (resolve, reject) => {
    // 跳转到指定页面
    await page.goto(url);
    // 获取tr，并且循环
    await page.waitForSelector('[class="WB_detail"]');
    await page.waitFor(3000);
    let detail = await page.$$('.WB_feed_detail');
    let data = await page.$$eval('[class="WB_detail"]', el => el.map(e => {
      const time = e.querySelector('.S_txt2 > a').title;
      const ti = new Date(time);
      return {
        time,
        span: ti.getTime(),
      };
    }))
    let index = -1;
    for (let i = 0, len = data.length; i < len; ++i) {
      if (data[i].span > lastTime) {
        index = i;
        break;
      }
    }
    if (index < 0) resolve({
      time: undefined
    });
    else {
      fs.writeFileSync(`weiboTime.txt`, data[index].time);
      const base64 = await detail[index].screenshot({
        encoding: "base64"
      })
      base64 ? resolve({
        base64,
        time: data[index].time,
        span: data[index].span
      }) : reject("errerbase64");
    }
  });
}

const botSendByWeiBo = async (bot) => {
  try {
    // 初始化无头浏览器
    const browser = await puppeteer.launch();
    // 新建页面
    const page = await browser.newPage();
    const list = JSON.parse(fs.readFileSync('store/hotSearch.json'))
    const values = Object.values(list);
    for (let i = 0, len = values.length; i < len; ++i) {
      console.log(`开始爬取${values[i].name}`)
      const op = await scrape(values[i].time, values[i].url, page);
      if (!op.time) continue;
      values[i].userId.forEach(el => {
        bot.sendMessage(el, `微博订阅推送--${op.time}` + s("image", {
          url: `base64://${op.base64}`
        }) + `如果嫌吵可以退订哦\n链接：${values[i].url}`);
      })
      list[values[i].name].time = op.span;
    };
    await fs.writeFileSync(
      `store/hotSearch.json`,
      JSON.stringify(list),
      "utf-8"
    );
    browser.close();
  } catch (err) {
    console.log(err);
  }
}


module.exports = async (ctx) => {
  const bot = ctx.bots[0];
  const rule = new nodeSchedule.RecurrenceRule();
  rule.minute = [0, 10, 20, 30, 40, 50];
  nodeSchedule.scheduleJob(rule, () => {
    // setInterval(() => botSendByWeiBo(bot), 1000*60*5);
    botSendByWeiBo(bot)
  })

}