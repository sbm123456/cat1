const puppeteer = require('puppeteer');
const fs = require("fs");
const { s, Random } = require('koishi-core')
function scrape(name) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`开始在weibo搜索${name}`);
      // 初始化无头浏览器
      const browser = await puppeteer.launch();
      // 新建页面
      const page = await browser.newPage();
      // 跳转到指定页面
      await page.goto(`https://s.weibo.com/weibo?q=${name}`);
      await page.waitForSelector('.card-user-b');
      const data = await page.$eval('div.card-user-b > .info > div > a', el => {
        return {
          url: el.href,
          name: el.innerHTML.replace(/<.*?>/g, ''),
          time: new Date().getTime() - 24*60*60*1000
        }
      })
      browser.close();
      data ? resolve(data) : reject("errer");
    } catch (error) {
      reject(error)
    }
  });
}


module.exports = async (text) => {
  const nametext = text.args[0];
  const groupId = text.session.groupId;
  const userId = text.session.author.userId;
  try {
    console.log("开始订阅", nametext)
    // const str = content.session.content;
    if (!nametext) return;
    const data = await scrape(nametext);
    const list = JSON.parse(fs.readFileSync('store/hotSearch.json'));
    if (list[data.name]) { // 如果搜索到重复的
      if (list[data.name].userId.includes(groupId)) {
        return `${s('at', {id: userId})}该微博已订阅! ${s('face', { id: `${Random.int(38, 39)}` })}`;
      }
      else list[data.name].userId.push(groupId);
    } else {
      list[data.name] = data;
      list[data.name].userId = [groupId];
    }
    await fs.writeFileSync(
      `store/hotSearch.json`,
      JSON.stringify(list),
      "utf-8"
    );
    return `${s('at', {id: userId})}关注成功! ${s('face', { id: `${Random.int(201, 204)}` })}\n微博名: ${data.name} \n链接:${data.url}`
  } catch (err) {
    console.log("失败啦", err);
    return `${s('at', {id: userId})}关注失败! ${s('face', { id: `${Random.int(0, 39)}` })}\n【${nametext}】 有多个搜索结果。`
  }
}