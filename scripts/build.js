const fs = require("node:fs");

const { INPUT_PATH, POSTS_PATH } = require("./src/constants.js");
const { generate } = require("./src/generate.js");
const { generateDirectoryTree } = require("./src/generateDirectoryTree.js");
const { generateFeed } = require("./src/generateFeed.js")
const { log } = require("./util/logger.js");

function main() {
  log.info("Here we go!");

  try {
    // Read files and dirs from INPUT_PATH and generate output tree for POSTS_PATH
    const tree = generateDirectoryTree(INPUT_PATH, POSTS_PATH);

    // Clean up posts dir
    log.info("Cleaning up", POSTS_PATH);
    fs.rmSync(POSTS_PATH, { recursive: true, force: true });
    fs.mkdirSync(POSTS_PATH);

    // Generate all posts and related index pages
    generate(tree);

    generateFeed(tree);
  } catch (e) {
    log.error("Failed to generate blog output", { errorMessage: e.message });
    log.error("FAIL!");
    return;
  }

  log.info("SUCCESS!");
}

main();
