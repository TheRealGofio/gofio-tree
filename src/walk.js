const fs = require("node:fs");
const path = require("node:path");
const { DEFAULT_IGNORES } = require("./constants");


function computeDirSizes(entries) {
  const children = new Map();

  for (const entry of entries) {
    const parent = entry.relPath === "." ? "." : path.dirname(entry.relPath);
    if (!children.has(parent)) {
      children.set(parent, []);
    }
    children.get(parent).push(entry);
  }

  const sizeCache = new Map();

  for (const entry of entries) {
    if (entry.isDirectory && !entry.isSymlink) {
      const size = computeSizeRecursive(entry.relPath, children, sizeCache);
      entry.size = size;
    }
  }
}

function computeSizeRecursive(relPath, children, sizeCache) {
  if (sizeCache.has(relPath)) {
    return sizeCache.get(relPath);
  }

  const kids = children.get(relPath) || [];
  let total = 0;

  for (const child of kids) {
    if (child.isSymlink) {
      total += child.size || 0;
    } else if (child.isDirectory) {
      total += computeSizeRecursive(child.relPath, children, sizeCache);
    } else {
      total += child.size || 0;
    }
  }

  sizeCache.set(relPath, total);
  return total;
}


function walkTree(rootDir, options = {}) {
  const maxDepth = options.maxDepth ?? 99;
  const showHidden = options.showHidden ?? false;
  const dirsOnly = options.dirsOnly ?? false;
  const showSize = options.showSize ?? false;
  const ignores = showHidden ? new Set() : (options.ignores ?? DEFAULT_IGNORES);
  const entries = [];
  const statsCache = new Map();

  function getStats(fullPath) {
    if (!statsCache.has(fullPath)) {
      statsCache.set(fullPath, fs.lstatSync(fullPath));
    }
    return statsCache.get(fullPath);
  }


  function visit(currentPath, currentDepth) {
    if (currentDepth > maxDepth) return;

    let dirEntries;
    try {
      dirEntries = fs.readdirSync(currentPath, { withFileTypes: true });
    } catch {
      return;
    }

    const visibleEntries = dirEntries
      .filter((entry) => {
        if (!showHidden && entry.name.startsWith(".")) {
          return false;
        }


        if (ignores.has(entry.name)) {
          return false;
        }


        return true;
      })
      .sort((a, b) => {
        const aFull = path.join(currentPath, a.name);
        const bFull = path.join(currentPath, b.name);

        const aStats = getStats(aFull);
        const bStats = getStats(bFull);

        const aDir = aStats.isDirectory();
        const bDir = bStats.isDirectory();

        if (aDir && !bDir) return -1;
        if (!aDir && bDir) return 1;
        return a.name.localeCompare(b.name);
      });


    for (const entry of visibleEntries) {
      const fullPath = path.join(currentPath, entry.name);
      const relPath = path.relative(rootDir, fullPath);
      const stats = getStats(fullPath);
      const entryDepth = currentDepth + 1;


      if (entryDepth > maxDepth) {
        continue;
      }


      const entryData = {
        fullPath,
        relPath,
        name: entry.name,
        depth: entryDepth,
        isDirectory: stats.isDirectory(),
        isSymlink: stats.isSymbolicLink(),
        size: stats.size
      };


      if (!dirsOnly || entryData.isDirectory) {
        entries.push(entryData);
      }


      if (stats.isDirectory() && !stats.isSymbolicLink()) {
        visit(fullPath, entryDepth);
      }
    }
  }


  visit(rootDir, 0);

  if (showSize) {
    computeDirSizes(entries, ignores, showHidden);
  }

  return entries;
}


module.exports = {
  walkTree
};