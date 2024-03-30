const fs = require('node:fs')
const util = require('util');
const { INPUT_PATH } = require('./src/constants')
const { log } = require('./util/logger.js')

const exec = require('child_process').exec;

const date = new Date()
const tzOffset = date.getTimezoneOffset() * 60000
const fileDate = new Date(Date.now() - tzOffset).toISOString().split('T')[0]
const postDate = date.toDateString()

const file = `${INPUT_PATH}/${fileDate}.txt`
log.info('Creating new post', file)
fs.writeFileSync(file, `[${postDate}]\n\n`)

log.info(`Opening ${file} in VSCODE`)
exec(`code -r ${file}`);
