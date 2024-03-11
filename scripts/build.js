const fs = require('node:fs')
const { generatePostHtml } = require('./postGenerator.js')
const { generateIndexHtml } = require('./indexGenerator.js')
const { INPUT_PATH, OUTPUT_PATH, ROOT_PATH } = require('./constants.js')

function main() {
  try {
    console.log(`[INFO] Reading posts from dir`)
    const posts = fs.readdirSync(INPUT_PATH)

    console.log(`[INFO] Generating HTML posts from text posts`)
    const generated = posts.map((fileName) => {
      const text = fs.readFileSync(`${INPUT_PATH}/${fileName}`, 'utf8')
      const generatedPost = generatePostHtml(text, fileName)
      return {
        name: fileName.split('.')[0],
        html: generatedPost
      }
    })

    console.log(`[INFO] Deleting output dir`)
    fs.rmdirSync(OUTPUT_PATH, { recursive: true, force: true })

    if (fs.existsSync(OUTPUT_PATH)){
      throw new Error('Output dir not deleted')
    }

    console.log(`[INFO] Creating output dir`)
    fs.mkdirSync(OUTPUT_PATH);

    console.log('[INFO] Generating home page')
    const homePage = generateIndexHtml(generated.map(({name}) => name))
    console.log('[INFO] Writing HTML home page to root')
    fs.writeFileSync(`${ROOT_PATH}/index.html`, homePage)
    
    console.log(`[INFO] Writing HTML posts to output dir`)
    generated.forEach(({name, html}) => {
      fs.writeFileSync(`${OUTPUT_PATH}/${name}.html`, html)
    })
  } catch (e) {
    console.log(`[ERROR]`, e.message)
  }
}

main()