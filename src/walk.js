const fs = require("node:fs");
const path = require("node:path");
const { DEFAULT_IGNORES } = require("./constants");
const { createGitignoreFilter } = require("./gitignore");


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


function makeSortComparator(sortBy, sortReverse) {
  return function compare(a, b, statsA, statsB) {
    const aDir = statsA.isDirectory();
    const bDir = statsB.isDirectory();

    if (aDir && !bDir) return -1;
    if (!aDir && bDir) return 1;

    let cmp;
    if (sortBy === "size") {
      cmp = statsA.size - statsB.size;
    } else if (sortBy === "mtime") {
      cmp = statsA.mtimeMs - statsB.mtimeMs;
    } else {
      cmp = a.name.localeCompare(b.name);
    }

    return sortReverse ? -cmp : cmp;
  };
}


function walkTree(rootDir, options = {}) {
  const maxDepth = options.maxDepth ?? 99;
  const showHidden = options.showHidden ?? false;
  const dirsOnly = options.dirsOnly ?? false;
  const showSize = options.showSize ?? false;
  const useGitignore = options.useGitignore ?? true;
  const sortBy = options.sortBy ?? "name";
  const sortReverse = options.sortReverse ?? false;

  const ignores = showHidden ? new Set() : (options.ignores ?? DEFAULT_IGNORES);
  const gitignoreFilter = useGitignore && !showHidden ? createGitignoreFilter(rootDir) : null;
  const entries = [];
  const statsCache = new Map();
  const comparator = makeSortComparator(sortBy, sortReverse);

  function getStats(fullPath) {
    if (!statsCache.has(fullPath)) {
      statsCache.set(fullPath, fs.lstatSync(fullPath));
    }
    return statsCache.get(fullPath);
  }

  function isIgnored(fullPath, relPath, name, isDir) {
    if (!showHidden && name.startsWith(".")) return true;
    if (ignores.has(name)) return true;
    if (gitignoreFilter && !gitignoreFilter(relPath)) return true;
    return false;
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
        const fullPath = path.join(currentPath, entry.name);
        const relPath = path.relative(rootDir, fullPath);
        return !isIgnored(fullPath, relPath, entry.name, entry.isDirectory());
      })
      .sort((a, b) => {
        const aFull = path.join(currentPath, a.name);
        const bFull = path.join(currentPath, b.name);

        const aStats = getStats(aFull);
        const bStats = getStats(bFull);

        return comparator(a, b, aStats, bStats);
      });

    for (const entry of visibleEntries) {
      const fullPath = path.join(currentPath, entry.name);
      const relPath = path.relative(rootDir, fullPath);
      const stats = getStats(fullPath);
      const entryDepth = currentDepth + 1;

      if (entryDepth > maxDepth) continue;

      const entryData = {
        fullPath,
        relPath,
        name: entry.name,
        depth: entryDepth,
        isDirectory: stats.isDirectory(),
        isSymlink: stats.isSymbolicLink(),
        size: stats.size,
        mtimeMs: stats.mtimeMs
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
    computeDirSizes(entries);
  }

  return entries;
}


module.exports = {
  walkTree
};
