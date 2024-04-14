const fs = require('node:fs')
const { headerFromTemplate, headBlockFromTemplate } = require('./headerTemplate.js')
const { POSTS_PATH, INPUT_PATH } = require('./constants.js')
const { log } = require('../util/logger.js')
const { calculateRelativePathString } = require('../util/calculateRelativePathString.js')

const htmlFromTemplate = (headBlock, header, content, fileName) => `<!DOCTYPE HTML>

<html>
  ${headBlock}

  <script>
    function setDate() {
      document.querySelectorAll('.date')
        .forEach(el => el.innerHTML = \`[\$\{new Date().toDateString()}]\`);
    }
  </script>

  <body onload="setDate()">
    ${header}

    <section id="terminal">
      <article>
        <div>~/timpepper.dev/blog <br class="mobile-break"><span class="date" /></div>
        <div>$&nbsp;cat ${fileName}</div>
        
${content}

        <div>~/timpepper.dev/blog <br class="mobile-break"><span class="date" /></div>
        <div>$&nbsp;<a href="./index.html">cd ../</a>&nbsp;<span id="cursor">&block;</span></div>
      </article>
    </section>
  </body>
</html>`

const generatePostHtml = (rawText, fileName, path) => {
  const relative = calculateRelativePathString(path)
  const headBlockContent = headBlockFromTemplate(`${relative}styles/terminal.css`)
  const headerContent = headerFromTemplate(relative)

  const htmlContent = rawText.replaceAll('\r\n', '\n')
    .split('\n\n')
    .filter(Boolean)
    .map((section) => `<p>${section}</p>`).join('\n')

  return htmlFromTemplate(headBlockContent, headerContent, htmlContent, fileName)
}

function generatePosts(path, posts) {
  log.info('[INFO] Writing posts for', path)
  const generated = posts
    .map((name) => {
      const postFileType = '.txt'
      const fileName = name + postFileType
      const inputPath = path.replace(POSTS_PATH, INPUT_PATH)
      const text = fs.readFileSync(`${inputPath}/${fileName}`, 'utf8')
      const generatedPost = generatePostHtml(text, fileName, path)
      return {
        name,
        html: generatedPost
      }
    })

  if (!fs.existsSync(path)){
    log.info('Creating directory', path)
    fs.mkdirSync(path);
  }
  
  generated.forEach(({name, html}) => {
    const fileName = `${path}/${name}.html`
    log.info('[INFO] Writing post', fileName)
    fs.writeFileSync(fileName, html)
  })
}

module.exports = {
  generatePosts
}