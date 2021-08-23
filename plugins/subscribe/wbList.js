const fs = require("fs");
const { s, Random } = require('koishi-core')

module.exports = async (text) => {
  const groupId = text.session.groupId;
  try {
    if (!groupId) return;
    let flag = false;
    let list = JSON.parse(fs.readFileSync('store/hotSearch.json'));
    let str = `鲨鲨bot${s('face', { id: `${Random.int(200, 204)}` })} 已订阅微博: `;
    if (Object.keys(list).length === 0) return `鲨鲨bot 未订阅微博 ${s('face', { id: `${Random.int(0, 39)}` })}`
    let num = 0;
    Object.keys(list).forEach((key) => {
      if (list[key].userId.includes(groupId)) {
        str+=`\n ${++num}. ${key}`;
        flag = true;
      }
    })
    if (!flag) return `鲨鲨bot 未订阅微博 ${s('face', { id: `${Random.int(0, 39)}` })}`;
    return str;
  } catch (err) {
    console.log("失败啦", err);
    return `查询失败! ${s('face', { id: `${Random.int(0, 39)}` })}\n 未知原因。`
  }
}