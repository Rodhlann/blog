const fs = require('node:fs')
const { headerFromTemplate } = require('./headerGenerator.js')
const { INPUT_PATH, POSTS_PATH } = require('./constants.js')

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

function generatePosts(output, path = INPUT_PATH, dirName = '') {
  try {
    const readPath = `${path}/${dirName}`
    
    console.log(`[INFO] Reading posts from dir -`, readPath)
    const contents = fs.readdirSync(readPath)

    const [posts, dirs] = contents.reduce(([posts, dirs], file) => 
      file.includes('.txt')
      ? [[...posts, file], dirs]
      : [posts, [...dirs, file]],
    [[],[]])

    console.log(`[INFO] Generating HTML posts from text posts`)
    const generated = posts
      .sort((a, b) => b.localeCompare(a))
      .map((fileName) => {
        const text = fs.readFileSync(`${readPath}/${fileName}`, 'utf8')
        const generatedPost = generatePostHtml(text, fileName)
        return {
          name: fileName.split('.')[0],
          html: generatedPost
        }
      })

    const outputDirName =  `${POSTS_PATH}${dirName && `/${dirName}`}`
    if (!fs.existsSync(outputDirName)){
      console.log(`[INFO] Creating dir`, outputDirName)
      fs.mkdirSync(outputDirName);
    }
    
    console.log(`[INFO] Writing HTML posts to output dir`)
    generated.forEach(({name, html}) => {
      fs.writeFileSync(`${outputDirName}/${name}.html`, html)
    })

    dirs.forEach((name) => {
      generatePosts(output, path, name)
    });

    output[outputDirName] = generated;
  } catch (e) {
    console.log(`[ERROR]`, e.message)
  }
}

module.exports = {
  generatePosts
}