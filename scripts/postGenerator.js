const { headerFromTemplate } = require('./headerGenerator.js')

const htmlFromTemplate = (body, fileName) => `<!DOCTYPE HTML>

<html>
  ${headerFromTemplate('../styles/terminal.css')}

  <script>
    function setDate() {
      document.querySelectorAll('.date')
        .forEach(el => el.innerHTML = \`[\$\{new Date().toDateString()}]\`);
    }
  </script>

  <body onload="setDate()">
    <header>
      <div>~/timpepper.dev/blog</div>
    </header>

    <section id="terminal">
      <article>
        <div>~/timpepper.dev/blog <br class="mobile-break"><span class="date" /></div>
        <div>$&nbsp;cat ${fileName}</div>
        
${body}

        <div>~/timpepper.dev/blog <br class="mobile-break"><span class="date" /></div>
        <div>$&nbsp;<a href="../index.html">cd ../</a>&nbsp;<span id="cursor">&block;</span></div>
      </article>
    </section>
  </body>
</html>`

const generatePostHtml = (rawText, fileName) => {
  const body = rawText.replaceAll('\r\n', '\n')
    .split('\n\n')
    .filter(Boolean)
    .map((section) => `<p>${section}</p>`).join('\n')

  return htmlFromTemplate(body, fileName)
}

module.exports = {
  generatePostHtml
}