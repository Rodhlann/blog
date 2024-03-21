const fs = require('node:fs')
const { generatePosts } = require('./postGenerator.js')
const { generateIndexHtml } = require('./indexGenerator.js')
const { INPUT_PATH, POSTS_PATH } = require('./constants.js')

function main_deprecated() {
  const generated = {}

  console.log('[INFO] Generating posts')
  generatePosts(generated)

  console.log('[INFO] Generating index.html')
  generateIndexHtml(generated)
}

function generateDirectoryTree(inputDir, outputDir, tree = []) {
  const files = fs.readdirSync(inputDir)
  const [posts, dirs] = files.reduce(([posts, dirs], file) => 
    file.includes('.txt')
    ? [[...posts, file], dirs]
    : [posts, [...dirs, file]],
  [[],[]])

  tree.push({
    name: outputDir,
    posts,
    dirs: []
  })

  dirs.forEach((name) => {
    const nextDir = `${outputDir}/${name}`
    tree[0].dirs.push(generateDirectoryTree(
        `${inputDir}/${name}`,
        nextDir, 
        tree[0]
      )
    )
  })

  return tree
}

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

function main() {
  // const readPath = `${path}/${dirName}`
    
  // console.log(`[INFO] Reading posts from dir -`, readPath)
  // const contents = fs.readdirSync(readPath)

  const tree = generateDirectoryTree(INPUT_PATH, POSTS_PATH)
  console.log(JSON.stringify(tree, null, 2))
}

main()