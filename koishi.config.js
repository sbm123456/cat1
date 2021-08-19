// 配置项文档：https://koishi.js.org/api/app.html
module.exports = {
  // Koishi 服务器监听的端口
  type: 'onebot:http',
  selfId: '2714324034',
  server: 'http://127.0.0.1:5700',
  secret: 'my-secret',
  port: 8080,
  plugins: {
    common: {
      onRepeat: {
        minTimes: 3,
        probability: 0.5,
      },
      onInterrupt: (state, session) =>
      state.repeated &&
      state.times >= 3 &&
      Math.random() > 0.5 &&
      segment.at(session.userId) + "在？为什么打断复读？",
    },
    webui: {},
    './my-plugin': {},
  },
}
