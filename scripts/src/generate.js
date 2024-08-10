const { generateIndexHtml } = require("./indexTemplate")
const { generatePosts } = require("./postTemplate")
const { log } = require("../util/logger")

/**
 * 
 * @param {import("./generateDirectoryTree").Branch[]} tree 
 */
const generateContent = ([...branches]) => {
  branches.forEach(({ path, posts, dirs }) => {
    log.info('Generating index and posts for', path)
    generateIndexHtml(path, posts, dirs)
    generatePosts(path, posts)
    generateContent(dirs)
  })
}

const parseTree = (branches) => {
  const allPosts = []

  branches.forEach(({ path, posts, dirs }) => {
    posts.forEach((post) => {
      allPosts.push({ path, name: post })
    })
    const nested = parseTree(dirs)
    allPosts.push([...nested]);
  })

  return allPosts.flat()
}

const flattenPosts = (branches) => parseTree(branches)

const generateLatestPosts = ([...branches]) => {
  log.info("Determining latest posts...");
  const posts = flattenPosts(branches)
    .sort((a, b) => b.name.localeCompare(a.name))
  posts.splice(5)
  return posts
}

module.exports = {
  generateContent,
  generateLatestPosts
}