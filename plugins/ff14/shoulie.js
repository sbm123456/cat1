const {
  s
} = require('koishi')
const puppeteer = require('puppeteer');

function scrape(name = "Moogle", page) {
  return new Promise(async (resolve, reject) => {
    // 跳转到指定页面
    await page.goto(`https://ffxivhunt.cn/${name}.html`);
    await page.waitForSelector('#t');
    const base64 = await page.screenshot({
      encoding: "base64"
    });
    base64 ? resolve(base64) : reject("errer");
  });
}
module.exports = async (content) => {
  // 初始化无头浏览器
  const browser = await puppeteer.launch();
  // 新建页面
  const page = await browser.newPage();
  try {
    const str = content.session.content;
    console.log("开始搜索狩猎车")
    let qufu = "Moogle";
    let num = "5";
    let title = "莫古力";
    if (str.includes("莫古力") || str.includes("猪")) {
      qufu = "Moogle";
      title = "莫古力"
    } else if (str.includes("陆行鸟") || str.includes("鸟")) {
      qufu = "Chocobo";
      title = "陆行鸟"
    } else if (str.includes("猫小胖") || str.includes("猫")) {
      qufu = "cat";
      title = "猫小胖"
    }
    if (str.includes("4")) num = "4";
    let data = await scrape(`${qufu}${num}`, page);
    await browser?.close();
    return `查询到${title}-${num}.0地区 狩猎车\n` + s("image", {
      url: `base64://${data}`
    })
  } catch (err) {
    await browser?.close();
    console.log(err)
  }
  await browser?.close();
}