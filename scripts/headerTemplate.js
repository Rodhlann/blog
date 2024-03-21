const headerFromTemplate = (stylesPath) => `<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>timpepper.dev</title>
    <meta name="viewport" content="width=device-width; initial-scale=1.0;">
    <link rel="stylesheet" href="${stylesPath}" />
  </head>`

module.exports = {
  headerFromTemplate
}