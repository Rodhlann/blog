const fs = require('node:fs')
const { headerFromTemplate } = require('./headerTemplate.js')
const { log } = require('./util/logger.js')

const htmlFromTemplate = (header, content) => `<!DOCTYPE HTML>

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
        <div>$&nbsp;<a href="../index.html">cd ../</a>&nbsp;<span id="cursor">&block;</span></div>
      </article>
    </section>
  </body>

</html>`


const generateIndexHtml = (path, posts, dirs) => {
  const postLinks = posts
    .map((name) => `<p>&nbsp;<a href="${path}/${name}.html">${name}.txt</a></p>`).join('\n')

  const dirLinks = dirs
    .map(({path}) => {
      const dirName = path.split('/').pop()
      return `<p>&nbsp;<b><a href="${path}">${dirName}/</a></b></p>`
    }).join('\n')
  
  const subdirCount = path.split('/').length - 1
  const subdirString = subdirCount === 0 ? '.' : [...Array(subdirCount)].reduce((acc, _) => acc += '../', '')
  const headerContent = headerFromTemplate(`${subdirString}styles/terminal.css`)

  const htmlContent = htmlFromTemplate(headerContent, `${postLinks}\n${dirLinks}`)

  log.info('[INFO] Writing index.html for', path)
  fs.writeFileSync(`${path}/index.html`, htmlContent)
}

module.exports = {
  generateIndexHtml
}