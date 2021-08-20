const nodeSchedule = require("node-schedule");
const puppeteer = require('puppeteer');
const { s } = require('koishi-core')
const fs = require("fs");

function scrape() {
  return new Promise(async (resolve, reject) => {
    // 初始化无头浏览器
    const browser = await puppeteer.launch();
    // 新建页面
    const page = await browser.newPage();
    // 跳转到指定页面
    await page.goto('https://ff.web.sdo.com/web8/index.html#/newstab/newslist');
    await page.waitForSelector('[class="nitemlick"]');
    let data = await page.$eval('[class="nitemlick"]', el => {
      const img = el.querySelector('div.npic > img').src;
      const title = el.querySelector('div.title').innerHTML;
      const content = el.querySelector('div.des').innerHTML;
      const time = el.querySelector('div.time').innerHTML;
      return {
        img,
        title,
        content,
        time
      }
    })
    const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));//创建newPagePromise对象
    const news_btn = await page.$('div.nitemlick');
    await news_btn.click();
    const newPage = await newPagePromise;
    const url = newPage.url();
    data['url'] = url;
    browser.close();
    data ? resolve(data) : reject("errer");
  });
}
const botSendByFFWeb = async (bot) => {
  try {
    const data = await scrape();
    const time = fs.readFileSync('FFWeb.txt');
    if (data.time === time.toString()) return;
    fs.writeFileSync(`FFWeb.txt`, data.time);
    let str_ = "----------"
    bot.sendMessage("815465250", `【FF14 国服官网最新新闻】\n${str_}\n${data.title}\n\n${data.content}` + s('image', { url: data.img }) + `日期：${data.time}  \n链接：${data.url}`);
} catch (err) {
    console.log("出错啦！！！", err);
  }
}


module.exports = async (ctx) => {
  const bot = ctx.bots[0];
  console.log("|----FF14官网订阅任务启动----|");
  // nodeSchedule.scheduleJob("0 30 * * * *", () => {
    console.log("准备获取FF14官网新闻");
    botSendByFFWeb(bot);
  // })
}

