const { INPUT_PATH, POSTS_PATH } = require('./constants.js')
const { generate } = require('./generate.js')
const { generateDirectoryTree } = require('./generateDirectoryTree.js')
const { log } = require('./util/logger.js')

function main() {
  log.info('Here we go!')

  try {
  // Read files and dirs from INPUT_PATH and generate output tree for POSTS_PATH
  const tree = generateDirectoryTree(INPUT_PATH, POSTS_PATH)

  // Generate all posts and related index pages
  generate(tree)
  } catch (e) {
    log.error('Failed to generate blog output', { errorMessage: e.message })
    log.error('FAIL!')
    return;
  }
  
  log.info('SUCCESS!')
}

main()