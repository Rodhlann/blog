const fs = require('node:fs')
const { headerFromTemplate, headBlockFromTemplate } = require('./headerTemplate.js')
const { POSTS_PATH, INPUT_PATH } = require('./constants.js')
const { log } = require('../util/logger.js')
const { calculateRelativePathString } = require('../util/calculateRelativePathString.js')

const htmlFromTemplate = (headBlock, header, content, path, fileName) => `<!DOCTYPE HTML>

<html>
  ${headBlock}
  
  <script>
    function computeSpacing() {
      const terminalStyle = window.getComputedStyle(document.getElementById("terminal"))
      const terminalHeight = Number(terminalStyle.getPropertyValue("height")
        .replace("px", ''))
      const terminalLineHeight = Number(terminalStyle.getPropertyValue("line-height")
        .replace("px", ''))

      const contentStyle = window.getComputedStyle(document.getElementById("terminal-vim-content"))
      const contentHeight = Number(contentStyle.getPropertyValue("height")
        .replace("px", ''))

      const footerStyle = window.getComputedStyle(document.getElementById("terminal-vim-footer"))
      const footerHeight = Number(footerStyle.getPropertyValue("height")
        .replace("px", ''))

      const terminalLines = Math.floor(terminalHeight / terminalLineHeight)
      const contentLines = Math.ceil(contentHeight / terminalLineHeight)
      const footerLines = Math.ceil(footerHeight / terminalLineHeight)

      const whiteSpace = terminalLines - contentLines - footerLines

      if (whiteSpace > 0) {
        const spacingEl = document.getElementById("terminal-vim-spacing")
        spacingEl.innerHTML = Array(whiteSpace).fill('').map(() => "~").join('\\n')
      }
    }
  </script>

  <body onload="computeSpacing()">
    ${header}

    <section id="terminal">
      <div id="terminal-vim-content">
${content}
      </div>
      <pre id="terminal-vim-spacing"></pre>
      <div id="terminal-vim-footer">
        <p id="terminal-vim-path">
${path}/${fileName} [read-only]
        </p>
        <a class="terminal-vim-command" href="#" onclick="history.back()">:q</a><span id="cursor">&block;</span>
      </div>
    </section>
  </body>
</html>`

const generatePostHtml = (rawText, fileName, path) => {
  const relative = calculateRelativePathString(path)
  const headBlockContent = headBlockFromTemplate(relative, 'styles/terminal.css')
  const headerContent = headerFromTemplate(relative)

  const htmlContent = rawText.replaceAll('\r\n', '\n')
    .split('\n\n')
    .filter(Boolean)
    .map((section) => `<p>${section}</p>`).join('\n')

  return htmlFromTemplate(headBlockContent, headerContent, htmlContent, path, fileName)
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
    if (!fileName.includes("_")) {
      log.info('[INFO] Writing post', fileName)
      fs.writeFileSync(fileName, html)
    }
  })
}

module.exports = {
  generatePosts
}