const { headerFromTemplate } = require('./headerGenerator.js')
const { POSTS_PATH } = require('./constants.js')

const htmlFromTemplate = (content) => `<!DOCTYPE HTML>

<html>
  ${headerFromTemplate('./styles/terminal.css')}

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

/*
  posts: { [ dir: string ]: { name: string; html: string }[] }
*/
const generateIndexHtml = (posts) => {
  const postLinks = posts[POSTS_PATH]
    .map(({name}) => `<p>&nbsp;<a href="./posts/${name}.html">${name}.txt</a></p>`).join('\n')
  const dirLinks = Object.keys(posts)
    .filter((key) => key !== POSTS_PATH)
    .map((dirName) => `<p>&nbsp;<b><a href=".${dirName.replace(POSTS_PATH, '')}">${dirName.replace(POSTS_PATH + '/', '')}/</a></b></p>`).join('\n')
  return htmlFromTemplate(`${postLinks}\n${dirLinks}`)
}

module.exports = {
  generateIndexHtml
}