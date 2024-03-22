const fs = require('node:fs')
const { headerFromTemplate } = require('./headerTemplate.js')
const { log } = require('./util/logger.js')
const { calculateRelativePathString } = require('./util/calculateRelativePathString.js')
const { POSTS_PATH, HOME_URL } = require('./constants.js')

const htmlFromTemplate = (header, content, backLink) => `<!DOCTYPE HTML>

<html>
  ${header}

  <script>
    function setDate() {
      document.querySelectorAll('.date')
        .forEach(el => el.innerHTML = \`[$\{new Date().toDateString()}]\`);
    }
  </script>

  <body onload="setDate()">
    <header>
      <div>~/timpepper.dev/blog</div>
    </header>

    <section id="terminal">
      <article>
        <div>~/timpepper.dev/blog <br class="mobile-break"><span class="date" /></div>
        <div>$&nbsp;ls -1</div>
         
${content}

        <div>~/timpepper.dev/blog <br class="mobile-break"><span class="date" /></div>
        <div>$&nbsp;<a href="${backLink}">cd ../</a>&nbsp;<span id="cursor">&block;</span></div>
      </article>
    </section>
  </body>

</html>`


const generateIndexHtml = (path, posts, dirs) => {
  const postLinks = posts
    .map((name) => `<p>&nbsp;<a href="./${name}.html">${name}.txt</a></p>`).join('\n')

  const dirLinks = dirs
    .map(({path}) => {
      const dirName = path.split('/').pop()
      return `<p>&nbsp;<b><a href="./${dirName}/index.html">${dirName}/</a></b></p>`
    }).join('\n')
  
  const relative = calculateRelativePathString(path)
  const headerContent = headerFromTemplate(`${relative}styles/terminal.css`)
  const backLink = path === POSTS_PATH ? HOME_URL : '../index.html'

  const htmlContent = htmlFromTemplate(
    headerContent, 
    `${postLinks}\n${dirLinks}`,
    backLink
  )

  if (!fs.existsSync(path)) {
    log.info('Creating directory', path)
    fs.mkdirSync(path)
  }

  log.info('Writing index.html for', path)
  fs.writeFileSync(`${path}/index.html`, htmlContent)
}

module.exports = {
  generateIndexHtml
}