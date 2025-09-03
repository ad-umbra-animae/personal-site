// .eleventy.js
const { DateTime } = require("luxon");

// helper: unique by inputPath
function uniqByInputPath(items) {
  const seen = new Set();
  return items.filter((it) => {
    if (seen.has(it.inputPath)) return false;
    seen.add(it.inputPath);
    return true;
  });
}

// helper: collect from multiple globs and sort newest->oldest
function collectionFromGlobs(collectionApi, globs) {
  const items = globs.flatMap((g) => collectionApi.getFilteredByGlob(g));
  return uniqByInputPath(items).sort((a, b) => b.date - a.date);
}

module.exports = function(eleventyConfig) {
  // date filter (you already had this)
  eleventyConfig.addFilter("date", (value = new Date(), format = "yyyy") => {
    return DateTime.fromJSDate(new Date(value)).toFormat(format);
  });

  // enable front matter excerpts
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- more -->"
  });

  // static assets passthrough
  eleventyConfig.addPassthroughCopy("src/css");
  // images passthrough
  eleventyConfig.addPassthroughCopy("src/images");

  // BLOG: src/blog/**/*.md
  eleventyConfig.addCollection("blog", (collectionApi) => {
    return collectionFromGlobs(collectionApi, ["src/blog/**/*.md"]);
  });

  // SCIENCE FICTION:
  // supports either src/science-fiction or src/sci-fi (use whichever you prefer)
  eleventyConfig.addCollection("scienceFiction", (collectionApi) => {
    return collectionFromGlobs(collectionApi, [
      "src/science-fiction/**/*.md",
      "src/scifi/**/*.md",
    ]);
  });

  // PHILOSOPHY: src/philosophy/**/*.md
  eleventyConfig.addCollection("philosophy", (collectionApi) => {
    return collectionFromGlobs(collectionApi, ["src/philosophy/**/*.md"]);
  });

  // PSYCHOLOGY: src/psychology/**/*.md
  eleventyConfig.addCollection("psychology", (collectionApi) => {
    return collectionFromGlobs(collectionApi, ["src/psychology/**/*.md"]);
  });

  // Optional: a unified "posts" collection (all four buckets)
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionFromGlobs(collectionApi, [
      "src/blog/**/*.md",
      "src/science-fiction/**/*.md",
      "src/scifi/**/*.md",
      "src/philosophy/**/*.md",
      "src/psychology/**/*.md",
    ]);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
  };
};