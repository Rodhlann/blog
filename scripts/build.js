const fs = require('node:fs')
const { generatePosts } = require('./postGenerator.js')
const { generateIndexHtml } = require('./indexGenerator.js')
const { ROOT_PATH } = require('./constants.js')

function main() {
  const generated = {}

  console.log('[INFO] Generating posts')
  generatePosts(generated)

  console.log('[INFO] Generating index.html')
  const homePage = generateIndexHtml(generated)

  console.log('[INFO] Writing HTML index.html to root')
  fs.writeFileSync(`${ROOT_PATH}/index.html`, homePage)
}

main()