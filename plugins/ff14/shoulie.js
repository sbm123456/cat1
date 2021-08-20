const { s } = require('koishi')
const puppeteer = require('puppeteer');

function scrape(name = "Moogle") {
  return new Promise(async (resolve, reject) => {
    // 初始化无头浏览器
    const browser = await puppeteer.launch();
    // 新建页面
    const page = await browser.newPage();
    // 跳转到指定页面
    await page.goto(`https://ffxivhunt.cn/${name}.html`);
    await page.waitForSelector('#t');
    const base64 = await page.screenshot({ encoding: "base64" });
    // let data = {};
    // let list = await page.$$eval('#t tr', el => el.map(e => {
    //   const TList = [];
    //   e.querySelectorAll('td').forEach(td => TList.push(td.innerHTML));
    //   return TList;
    // }
    // ));

    // data["title"] = await page.$eval('p', el => el.innerHTML);
    // data["list"] = list;
    browser.close();
    base64 ? resolve(base64) : reject("errer");
  });
}
module.exports = async (content) => {
  try {
    const str = content.session.content;
    console.log("开始搜索狩猎车")
    let qufu = "Moogle"; let num = "5"; let title = "莫古力";
    if (str.includes("莫古力") || str.includes("猪")) {
      qufu = "Moogle";title = "莫古力"
    } else if (str.includes("陆行鸟") || str.includes("鸟")) {
      qufu = "Chocobo"; title = "陆行鸟"
    } else if (str.includes("猫小胖") || str.includes("猫")) {
      qufu = "cat"; title = "猫小胖"
    }
    if (str.includes("4")) num = "4";
    let data = await scrape(`${qufu}${num}`);
    return `查询到${title}-${num}.0地区 狩猎车\n` + s("image", { url: `base64://${data}` })
  } catch (err) {
    console.log(err)
  }
}