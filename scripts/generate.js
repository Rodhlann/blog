const { generateIndexHtml } = require("./indexTemplate")
const { generatePosts } = require("./postTemplate")
const { log } = require("./util/logger")

/**
 * 
 * @param {import("./generateDirectoryTree").Branch[]} tree 
 */
const generate = ([...branches]) => {
 branches.forEach(({ path, posts, dirs }) => {
  log.info('Generating index and posts for', path)
  generateIndexHtml(path, posts, dirs)
  generatePosts(path, posts)
  generate(dirs)
 })
}

module.exports = {
 generate
}