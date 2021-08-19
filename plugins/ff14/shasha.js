const { readFile } = require('fs/promises')
const { s, Random } = require('koishi-core')

exports.shasha = async (num, content = "") => {
  let ran = Random.int(1, 4)
  let cardIcon;
  if (num > 80) {
    cardIcon = await readFile(`${__dirname}/assets/shasha/top${ran}.jpg`);
  } else if (num < 20) {
    cardIcon = await readFile(`${__dirname}/assets/shasha/bottom${ran}.jpg`);
  } else if (content.includes("宜：钓鱼") || content.includes("宜：海钓")) {
    cardIcon = await readFile(`${__dirname}/assets/shasha/diaoyu.jpg`);
  } else {
    cardIcon = await readFile(`${__dirname}/assets/shasha/center${ran}.jpg`);
  }
  console.log("sad")
  return `base64://${cardIcon.toString('base64')}`
}