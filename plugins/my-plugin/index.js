const { nuannan } = require("./nuannan");
// const { shasha } = require('../ff14/shasha');
const { s, Random } = require('koishi-core')
const { readFile } = require('fs/promises')

module.exports = (ctx, bot) => {
  ctx.middleware(async (session, next) => {
    const { userId, content } = session;
    // console.log(content);
    if (userId === '1323437072') {
      const op = content.match(/\[(.+?)\]/g);
      const oq = content.match(/(运势：)(\S*)%/);
      if (op && oq) {
        const uid = op[0].match(/id=(\d+)/)[1];
        if (Number(oq[2]) < 10  && uid !== "2714324034") {
          let num = Random.int(0, nuannan.length - 1);
          session.send(`${op[0]} ${nuannan[num]}`)
        } else if (uid === "2714324034") {
          let ran = Random.int(1, 4);
          let num = Number(oq[2]);
          let cardIcon;
          if (num > 80) {
            cardIcon = await readFile(`./plugins/ff14/assets/shasha/top${ran}.jpg`);
          } else if (num < 20) {
            cardIcon = await readFile(`./plugins/ff14/assets/shasha/bottom${ran}.jpg`);
          } else if (content.includes("宜：钓鱼") || content.includes("宜：海钓")) {
            cardIcon = await readFile(`./plugins/ff14/assets/shasha/diaoyu.jpg`);
          } else {
            cardIcon = await readFile(`./plugins/ff14/assets/shasha/center${ran}.jpg`);
          }
          session.send(s('image', { url: `base64://${cardIcon.toString('base64')}` }))
        }
      }
    }
    if (session.content === '???') {
      session.send('??')
    }
    return next()
  })
}