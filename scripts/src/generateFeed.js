const fs = require("node:fs");
const { ROOT_PATH, BLOG_URL, INPUT_PATH, POSTS_PATH } = require("./constants.js");

const getDate = (dateString) => {
  return (dateString ? new Date(dateString) : new Date()).toUTCString();
};

const buildItem = ({ title, link, description, date }) => `\n      <item>
        <title>${title}</title>
        <link>${link}</link>
        <guid>${link}</guid>
        <description>${description}</description>
        <category>coding</category>
        <pubDate>${getDate(date)}</pubDate>
      </item>`;

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

const buildItems = (posts) => {
  return posts.reduce((postAcc, { path, name }) => {
    const inputPostFileType = '.txt'
    const inputFileName = name + inputPostFileType
    const textBlocks = fs.readFileSync(`${path}/${inputFileName}`, 'utf8')
      ?.replaceAll('\r\n', '\n').split("\n\n");
    const heading = textBlocks.shift();
    const date = heading.substring(1, heading.length - 1);

    const postContent = textBlocks.join(" ");
    const postLength = postContent.length;
    const trunc = 150;
    const truncLength = postLength > trunc ? trunc : postLength;
    const truncEllipse = postLength > trunc ? "..." : "";
    const description = postContent.slice(0, truncLength).trim() + truncEllipse;

    const outputPostFileType = '.html'
    const outputFileName = name + outputPostFileType
    const outputPath = path.replace(ROOT_PATH, '')

    const link = `${BLOG_URL}${outputPath}/${outputFileName}`;

    return (postAcc += buildItem({
      title: `${date} (${path.replace(INPUT_PATH + '/', '')})`,
      link,
      description,
      date: getDate(date),
    }));
  }, "");
};

const generateFeed = (tree) => {
  const posts = flattenPosts(tree)
    .sort((a, b) => b.name.localeCompare(a.name))

  const feed = `<?xml version="1.0"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <atom:link href="https://timpepper.dev/blog/posts/feed/rss.xml" rel="self" type="application/rss+xml" />
      <title>timpepper.dev blog</title>
      <link>https://timpepper.dev/blog</link>
      <description>The RSS feed for the timpepper.dev blog</description>
      <language>en-us</language>
      <lastBuildDate>${getDate()}</lastBuildDate>
      <generator>timpepper.dev static site generator</generator>
      ${buildItems(posts)}
    </channel>
  </rss>`;

  const directory = POSTS_PATH + "/feed";
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  fs.writeFileSync(`${directory}/rss.xml`, feed);
};

module.exports = {
  generateFeed,
};
