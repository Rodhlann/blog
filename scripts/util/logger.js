const DEFAULT = '\x1b[39m'
const GREEN = (text) => `\x1b[32m${text}${DEFAULT}`
const RED = (text) => `\x1b[91m${text}${DEFAULT}`

const log = {
 info: (string, ...context) => console.log(GREEN('[INFO]'), string, ...context),
 error: (string, ...context) => console.error(RED('[ERROR]'), string, ...context),
}

module.exports = {
 log
}