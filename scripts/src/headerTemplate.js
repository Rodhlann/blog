const headBlockFromTemplate = (relativePath, stylesPath) => `<head>
    <meta http-equiv="Content-Type" content="text/html, charset=UTF-8" />
    <title>timpepper.dev</title>
    <link rel="icon" href="${relativePath}images/terminal.png" type="image/x-icon">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="${relativePath}${stylesPath}" />
  </head>`

const headerFromTemplate = (relativePath) => `<header>
  <div class="header-text">~/timpepper.dev/blog</div>
    <div class="rss-link-wrapper">
      <a class="rss-link" href="https://timpepper.dev/blog/posts/feed/rss.xml">
        <img class="rss-icon" src="${relativePath}images/rss-vector.png" alt="RSS Feed Logo">
      </a>
    </div>
  </header>`

module.exports = {
  headBlockFromTemplate,
  headerFromTemplate
}