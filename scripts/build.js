const fs = require("node:fs");

const { INPUT_PATH, POSTS_PATH } = require("./src/constants.js");
const { generateContent, generateLatestPosts } = require("./src/generate.js");
const { generateDirectoryTree } = require("./src/generateDirectoryTree.js");
const { generateFeed } = require("./src/generateFeed.js")
const { log } = require("./util/logger.js");

function copyFiles(latest) {
  log.info("Copying latest posts to top-level index...")
  latest.forEach(({ path, name }) => {
    const from = `${path}/${name}.txt`
    const to = `${INPUT_PATH}/${path.split('/')[2]}_${name}.txt`
    log.info(`Copying ${from} to ${to}`)
    fs.copyFileSync(from, to)
  })
  log.info("Copy complete!")
}

function main() {
  log.info("Here we go!");

  try {
    // Clean up
    log.info("Delete output dir", POSTS_PATH);
    fs.rmSync(POSTS_PATH, { recursive: true, force: true });
    fs.mkdirSync(POSTS_PATH);

    // Read files and dirs from INPUT_PATH and generate output tree for INPUT_PATH
    const tree = generateDirectoryTree(INPUT_PATH, INPUT_PATH);

    // Copy latest posts to top-level index
    const latest = generateLatestPosts(tree);
    copyFiles(latest);

    // Read files and dirs from INPUT_PATH and generate output tree for POSTS_PATH
    const updatedTree = generateDirectoryTree(INPUT_PATH, POSTS_PATH);
    
    // Generate all posts and related index pages
    generateContent(updatedTree);

    generateFeed(tree);

    log.info("Clean up temp files...")
    fs.readdirSync(INPUT_PATH)
      .filter((file) => file.includes(".txt"))
      .forEach((file) => fs.rmSync(`${INPUT_PATH}/${file}`))
  } catch (e) {
    log.error("Failed to generate blog output", { errorMessage: e.message });
    log.error("FAIL!");
    return;
  }

  log.info("SUCCESS!");
}

main();
