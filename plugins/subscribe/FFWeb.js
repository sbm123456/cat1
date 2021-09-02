const nodeSchedule = require("node-schedule");
const puppeteer = require('puppeteer');
const { s } = require('koishi-core')
const fs = require("fs");

function scrape(page, browser) {
  return new Promise(async (resolve, reject) => {
    console.log("准备获取FF14官网新闻");
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
    data ? resolve(data) : reject("errer");
  });
}
const botSendByFFWeb = async (bot) => {
  let browser;
  try {
    browser = await puppeteer.launch();
    // 新建页面
    const page = await browser.newPage();
    const data = await scrape(page, browser);
    const title = fs.readFileSync('FFWeb.txt');
    if (data.title === title.toString()) return;
    fs.writeFileSync(`FFWeb.txt`, data.title);
    let str_ = "----------";
    await browser?.close();
    console.log("asds", data.img);
    bot.$sendGroupForwardMsg("815465250", [
      {
        "type": "node",
        "data": {
          "name": "鲨鲨播报员",
          "uin": 2714324034,
          "content": `【FF14 国服官网最新新闻】\n${str_}\n${data.title}\n\n${data.content}` + `[CQ:image,file=${data.img}]` + `\n日期：${data.time}  \n`
        }
      },
      {
        "type": "node",
        "data": {
          "name": "鲨鲨播报员",
          "uin": 2714324034,
          "content": `链接：${data.url}`
        }
      }
    ])
} catch (err) {
    browser?.close();
    console.log("出错啦！！！", err);
  }
}


module.exports = async (ctx) => {
  const bot = ctx.bots[0];
  console.log("|----FF14官网订阅任务启动----|");
  nodeSchedule.scheduleJob("0 25 * * * *", () => {
    botSendByFFWeb(bot);
  })
}