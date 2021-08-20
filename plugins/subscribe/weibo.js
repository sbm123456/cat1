const nodeSchedule = require("node-schedule");
const puppeteer = require('puppeteer');
const fs = require("fs");

function scrape() {
  return new Promise(async (resolve, reject) => {
    // 初始化无头浏览器
    const browser = await puppeteer.launch();
    // 新建页面
    const page = await browser.newPage();
    // 跳转到指定页面
    await page.goto('https://weibo.com/cnff14?is_all=1');
    // 获取tr，并且循环
    await page.waitForSelector('[class="WB_detail"]');
    let data = await page.$$eval('[class="WB_detail"]', el => {
      const text = el[1].querySelector('div.WB_text').innerHTML;
      const name = el[1].querySelector('.WB_info > a').innerHTML;
      const time = el[1].querySelector('.S_txt2 > a').title;
      const content = text.replace(/(^[\s\n\t]+|[\s\n\t]+$)/g, "");
      return {
        name,
        time,
        content
      }
    })
    if (data.content.includes(`展开全文<i`)) {
      let herfList = data.content.match(/href="(.*?)"/g);
      let newHerf = herfList[herfList.length - 1].slice(6, -1)
      const page1 = await browser.newPage();
      await page1.goto("https://" + newHerf);
      await page1.waitForSelector('[class="WB_detail"]');
      data = await page1.$$eval('[class="WB_detail"]', el => {
        const text = el[0].querySelector('div.WB_text').innerHTML;
        const name = el[0].querySelector('.WB_info > a').innerHTML;
        const time = el[0].querySelector('.S_txt2 > a').title;
        const content = text.replace(/(^[\s\n\t]+|[\s\n\t]+$)/g, "");
        return {
          name,
          time,
          content
        }
      })
    }
    // browser.close();
    data ? resolve(data) : reject("errer");
  });
}
const op = `
【投稿】责怪别人离开之前先检讨一下自己怎么对待别人的，别装出一副伤透心的样子了，心理疾病不是你肆意伤害别人的理由，检讨下自己配不配拥有友谊吧（再说了别人只是不想被你折磨，日随导随陪你，清cd给你补奶，在我看来她已经够舔🐶了） ​​`

const botSendByWeiBo = async (bot) => {
  try {
    // const data = await scrape();
    // const time = fs.readFileSync('weiboTime.txt');
    // if (data.time === time.toString()) return;
    // fs.writeFileSync(`weiboTime.txt`, data.time);
    // console.log(data);
    
    // bot.sendMessage("815465250", `${data.name}: \n${data.content}`);
    bot.sendMessage("635246373", op);
  } catch (err) {
    console.log(err);
  }
}


module.exports = async (ctx) => {
  const bot = ctx.bots[0];
  console.log("|----微博订阅任务启动----|");
  // nodeSchedule.scheduleJob("0 * * * * *", () => {
    botSendByWeiBo(bot);
  // })

  // if (op.includes(`展开全文<i`)) {
  //   let herfList = op.match(/href="(.*?)"/g);

  //   // const page1 = await browser.newPage();
  //   // await page1.goto('https://weibo.com/cnff14?is_all=1');
  // }
}

