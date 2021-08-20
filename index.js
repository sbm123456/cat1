const {
  App
} = require('koishi')

// 你需要手动安装适配器
require('koishi-adapter-onebot')

const app = new App({
  port: 8080,
  // 这部分与上面的配置文件作用基本相同
  type: 'onebot:http',
  // 对应 cqhttp 配置项 http_config.port
  server: 'http://127.0.0.1:5700',
  type: 'onebot:http',
  selfId: '1323437072',
  secret: 'my-secret',
  minSimilarity: 0,
  nickname: '鲨鲨'
})

// 注册插件，作用相当于上面配置文件中的 plugins 部分
app.plugin(require('koishi-plugin-common'), {
  onRepeat: {
    minTimes: 3,
    probability: 0.5,
  },
  respondent: [{
    match: /^找.*导师$/,
    reply: "鲨鲨bot偷偷发一个萌新招待网站:https://actff1.web.sdo.com/20190315Zhaodai/index.html#/index"
  },
]

})
// app.plugin(require('koishi-plugin-webui'))
// app.plugin(require('./plugins/my-plugin'))
app.plugin(require('./plugins/ff14'))
app.plugin(require('./plugins/subscribe'))
// 启动应用
app.start()