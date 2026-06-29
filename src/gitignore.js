const fs = require("node:fs");
const path = require("node:path");
const Ignore = require("ignore");

function collectGitignoreRules(rootDir) {
  const ig = Ignore();

  let current = path.resolve(rootDir);
  const roots = [];

  while (true) {
    roots.unshift(current);
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  for (const dir of roots) {
    const giPath = path.join(dir, ".gitignore");
    try {
      const content = fs.readFileSync(giPath, "utf8");
      ig.add(content);
    } catch {
      // No .gitignore in this directory
    }
  }

  return ig;
}

function createGitignoreFilter(rootDir) {
  const ig = collectGitignoreRules(rootDir);
  if (!ig) return null;

  return (relPath) => {
    if (!relPath || relPath === ".") return true;
    const relative = relPath.startsWith("/") ? relPath.slice(1) : relPath;
    return !ig.ignores(relative);
  };
}

module.exports = {
  createGitignoreFilter
};
