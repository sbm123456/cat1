const request = require("request");
const fs = require("fs");

module.exports = async (text) => {
  const nametext = text.args[0];
  const groupId = text.session.groupId;
  const userId = text.session.author.userId; // QQ号
  const username = text.session.author.username; // 备注
  let nickname = text.session.author.nickname; // 备注
  console.log(nickname);
  if (!nametext) return;
  let url = nametext.match(/url=(.*?)]/)[1]
  const req = request(url);
  let nickname1 = nickname.substring(0, nickname.indexOf('-'));
  const targetPath = `./buduiImage/${nickname1 || nickname || username}_${userId}.png`;
  try {
    const stream = fs.createWriteStream(targetPath);
    let len = 0
    let cur = 0
    req.pipe(stream);
    req.on('response', (data) => {
      len = parseInt(data.headers['content-length'])
    })
    req.on('data', (chunk) => {
      cur += chunk.length
    })
    req.on('end', function () {
      if (req.response.statusCode === 200) {
        if (len === cur) {
          console.log('图片下载完毕')
        } else {
          stream.end()
          console.log('网络波动，下载文件不全')
        }
      } else {
        stream.end()
      }
    })
    req.on('error', (e) => {
      stream.end()
      if (len !== cur) {
        console.log('网络波动，下载失败')
      } else {
        console.log('网络波动，下载失败')
      }
    })
  } catch (err) {
    console.log("部队添加失败", err);
  }
}