const formatBytes = b => {
  let order = 0
  const orderLetter = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  while (b >= 1024) {
    b = b / 1024
    order += 1
  }
  return `${b.toFixed(2)} ${orderLetter[order]}`
}

const displayBytes = (title, rx, tx) => {
  return `${title}：`
    + `${formatBytes(rx + tx)} `
    + `（接收 ${formatBytes(rx)}，发送 ${formatBytes(tx)}）\n`
}

const sessioner = session => {
  let user = `${session.userId}(${session.sender.nickname})`
  let userInfo
  switch (session.messageType) {
    case 'private':
      userInfo = `P/${user}`
      break
    case 'group':
      userInfo = `G/${session.groupId} U/${user}[${session.sender.card}]`
      break
    default:
      userInfo = ''
  }
  return userInfo
}

module.exports.formatBytes = formatBytes
module.exports.displayBytes = displayBytes
module.exports.sessioner = sessioner