const puppeteer = require('puppeteer');
const fs = require("fs-extra");

const scrape = (page) => {
  return new Promise(async (resolve, reject) => {
    // 跳转到指定页面
    await page.goto(`${__dirname}/budui.html`);
    const base64 = await page.screenshot({
      encoding: "base64",
      fullPage: true
    });
    base64 ? resolve(base64) : reject("errer");
  });
}

module.exports = async (text, ctx) => {
  const groupId = text.session.groupId;
  const bot = ctx.bots[0];
  // 初始化无头浏览器
  const browser = await puppeteer.launch();
  // 新建页面
  const page = await browser.newPage();
  try {
    const list = fs.readdirSync('./buduiImage');
    const htmlHeader = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>* {padding: 0;margin: 0;}.title {background-image: url("../../buduiImage/buduifang.jpg");width: 100%;height: 300px;background-size: 100%;background-position: 100% 52%;display: flex;align-items: flex-end;justify-content: flex-end;}.title > div {font-family: "Comic Sans MS", cursive, sans-serif;font-size: 24px;color: white;font-weight: 600;margin: 10px;letter-spacing: 1px;}.card {margin-top: 10px;position: relative;}.page {display: flex;flex-wrap: wrap;justify-content: space-around;}.name {position: absolute;top: 9px;padding: 1px 4px 1px 4px;border-radius: 0 2px 2px 0;background-color: rgb(235 231 231 / 55%);font-family: "Lucida Console", Monaco, monospace;}img {max-height: 240px;border-radius: 5px;box-shadow: rgba(0,0,0,0.2) 0 1px 5px 0px;}</style><title>Document</title></head>';
    let htmlBody = '<body><div class="title"><div>旅人栈桥-《八方旅人》部队</div></div><div class="page">';
    list.forEach(el => {
      if (el !== 'buduifang.jpg') {
        const name = el.substring(0, el.indexOf('_'));
        htmlBody += `<div class="card"><img src="../../buduiImage/${el}" alt="${name}"/><div class="name">${name}</div></div>`
      }
    })
    const htmlfoot = "</div></body></html>";
    fs.outputFileSync(`${__dirname}/budui.html`, htmlHeader + htmlBody + htmlfoot);
    let data = await scrape(page);
    bot.$sendGroupForwardMsg(groupId, [
      {
        "type": "node",
        "data": {
          "name": "鲨鲨小助手",
          "uin": 2714324034,
          "content": `[CQ:image,file=base64://${data}]`
        }
      },
    ])
    await browser?.close();
  } catch (err) {
    await browser?.close();
    console.log("获取部队合集失败", err)
  }
  await browser?.close();
}