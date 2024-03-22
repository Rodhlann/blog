const fs = require('node:fs')
const { log } = require('./util/logger')

// [
//   {
//     name: '.',
//     posts: [ 'a.txt', 'b.txt' ],
//     dirs: [
//       {
//         name: './code',
//         posts: [ 'c.txt', 'd.txt' ],
//         dirs: []
//       },
//       {
//         name: './bread',
//         posts: [ 'e.txt', 'f.txt' ],
//         dirs: []
//       }
//     ]
//   }
// ]

/**
 * 
 * @param {string} inputDir
 * @param {string} outputDir
 * 
 * @typedef Branch
 * @type { path: string; posts: string[]; dirs: Branch[] }
 * 
 * @param {Branch[]} tree
*/
function generateDirectoryTree(inputDir, outputDir, tree = []) {
 log.info('Recursively building output tree for', inputDir)
 const files = fs.readdirSync(inputDir)
 const [posts, dirs] = files.reduce(([posts, dirs], file) => 
   file.includes('.txt')
   ? [[...posts, file], dirs]
   : [posts, [...dirs, file]],
 [[],[]])

 // Posts should be newest first
 posts.sort((a, b) => b.localeCompare(a))

 tree.push({
   path: outputDir,
   posts: posts.map((post) => post.replace('.txt', '')),
   dirs: []
 })

 dirs.forEach((name) => {
   const nextDir = `${outputDir}/${name}`
   generateDirectoryTree(
     `${inputDir}/${name}`,
     nextDir, 
     tree[0].dirs
   )
 })

 return tree
}

module.exports = {
 generateDirectoryTree
}