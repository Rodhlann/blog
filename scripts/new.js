const fs = require('node:fs')
const { INPUT_PATH } = require('./src/constants')
const { log } = require('./util/logger.js')

var args = process.argv.slice(2);

if (args.length != 1) {
  log.error('Invalid input!!')
  log.info('Please provide a subject')
  log.info('Examples:')
  log.info('node scripts/new.js code')
  log.info('node scripts/new.js FITNESS')
  process.exit(1)
}

const directory = args[0].toUpperCase();

const date = new Date()
const tzOffset = date.getTimezoneOffset() * 60000
const fileDate = new Date(Date.now() - tzOffset).toISOString().split('T')[0]
const postDate = date.toDateString()

if (!fs.existsSync(`${INPUT_PATH}/${directory}`)) {
  log.info('Creating directory', `${INPUT_PATH}/${directory}`)
  fs.mkdirSync(`${INPUT_PATH}/${directory}`)
}

const file = `${INPUT_PATH}/${directory}/${fileDate}.txt`
log.info('Creating new post', file)
fs.writeFileSync(file, `[${postDate}]\n\n`)

log.info(`Opening ${file} in VSCODE`)