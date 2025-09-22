const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Pass through assets and your compiled Tailwind file to dist/
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/styles/output.css": "styles.css" });

  // Collections by category (newest first)
  const makeCollection = (glob) => (col) =>
    col.getFilteredByGlob(glob).sort((a, b) => b.date - a.date);

  eleventyConfig.addCollection("blog", makeCollection("src/pages/blog/**/*.{md,html}"));
  eleventyConfig.addCollection("fiction", makeCollection("src/pages/fiction/**/*.{md,html}"));
  eleventyConfig.addCollection("nonfiction", makeCollection("src/pages/nonfiction/**/*.{md,html}"));

  // Shortcode to print prev/next for a given collection (Nunjucks-aware)
  eleventyConfig.addNunjucksShortcode("PrevNext", function(collectionName, page) {
    const items = this.ctx.collections[collectionName] || [];
    const i = items.findIndex(p => p.url === page.url);
    const prev = items[i + 1]; // because sorted newest->oldest
    const next = items[i - 1];
    const homeHref = collectionName === "blog" ? "/blog/" :
                     collectionName === "fiction" ? "/fiction/" : "/nonfiction/";
    return `
      <nav class="text-sm flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a class="hover:underline" href="${homeHref}">Home</a>
          <span class="opacity-50">|</span>
          ${prev ? `<a class="hover:underline" href="${prev.url}">← Previous</a>` : `<span class="opacity-40">← Previous</span>`}
          ${next ? `<a class="hover:underline" href="${next.url}">Next →</a>` : `<span class="opacity-40">Next →</span>`}
        </div>
        <a class="hover:underline" href="#top">↑ Top</a>
      </nav>`;
  });

  // Date formatting filter for Nunjucks (uses Luxon)
  eleventyConfig.addFilter("date", (dateInput, fmt = "LLL d, yyyy", zone = "local") => {
    let d;
    if (dateInput instanceof Date) {
      d = DateTime.fromJSDate(dateInput);
    } else {
      d = DateTime.fromISO(String(dateInput));
      if (!d.isValid) d = DateTime.fromJSDate(new Date(dateInput));
    }
    return d.setZone(zone).toFormat(fmt);
  });

  // Word count (plain text)
  eleventyConfig.addFilter("wordCount", (str = "") => {
    const text = String(str)
      .replace(/<[^>]*>/g, " ")        // strip HTML tags
      .replace(/&[a-z#0-9]+;/gi, " ")  // strip HTML entities
      .replace(/\s+/g, " ")            // collapse whitespace
      .trim();
    if (!text) return 0;
    return text.split(" ").length;
  });

  // Reading time (defaults to 220 wpm)
  eleventyConfig.addFilter("readingTime", (str = "", wpm = 220) => {
    const words = eleventyConfig.getFilter("wordCount")(str);
    if (words === 0) return "0 min";
    const minutes = words / wpm;
    if (minutes < 1) {
      const secs = Math.max(30, Math.round(minutes * 60 / 15) * 15); // 15s granularity
      return `${secs}s`;
    }
    return `${Math.max(1, Math.round(minutes))} min`;
  });

  return {
    dir: {
      input: "src",           // 11ty reads from src/
      includes: "_includes",  // layouts live here
      output: "dist"          // same deploy folder
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};