const { headerFromTemplate } = require('./headerGenerator.js')

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

const generateIndexHtml = (posts) => {
  const content = posts.map((name) => `<p>&nbsp;<a href="./posts/${name}.html">${name}.txt</a></p>`).join('\n')
  return htmlFromTemplate(content)
}

module.exports = {
  generateIndexHtml
}