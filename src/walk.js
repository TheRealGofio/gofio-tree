const fs = require("node:fs");
const path = require("node:path");
const { DEFAULT_IGNORES } = require("./constants");
const { createGitignoreFilter } = require("./gitignore");


function getDirSize(dirPath, ignores, showHidden, maxDepth, currentDepth, sizeCache) {
  if (sizeCache && sizeCache.has(dirPath)) {
    return sizeCache.get(dirPath);
  }

  let totalSize = 0;

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!showHidden && entry.name.startsWith(".")) {
        continue;
      }
      if (ignores.has(entry.name)) {
        continue;
      }

      const fullPath = path.join(dirPath, entry.name);
      const stats = fs.lstatSync(fullPath);

      if (stats.isDirectory() && !stats.isSymbolicLink()) {
        totalSize += getDirSize(fullPath, ignores, showHidden, maxDepth, currentDepth + 1, sizeCache);
      } else {
        totalSize += stats.size;
      }
    }
  } catch {
    // Skip directories we can't read
  }

  if (sizeCache) {
    sizeCache.set(dirPath, totalSize);
  }
  return totalSize;
}


function makeSortComparator(sortBy, sortReverse) {
  return function compare(a, b, statsA, statsB) {
    const aDir = statsA.isDirectory();
    const bDir = statsB.isDirectory();

    // Dirs always first (reversing the tree would be confusing)
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
  const sizeCache = new Map();
  const entries = [];
  const comparator = makeSortComparator(sortBy, sortReverse);


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

    const statsCache = new Map();

    const visibleEntries = dirEntries
      .filter((entry) => {
        const fullPath = path.join(currentPath, entry.name);
        const relPath = path.relative(rootDir, fullPath);
        return !isIgnored(fullPath, relPath, entry.name, entry.isDirectory());
      })
      .sort((a, b) => {
        const aFull = path.join(currentPath, a.name);
        const bFull = path.join(currentPath, b.name);

        if (!statsCache.has(aFull)) {
          statsCache.set(aFull, fs.lstatSync(aFull));
        }
        if (!statsCache.has(bFull)) {
          statsCache.set(bFull, fs.lstatSync(bFull));
        }

        return comparator(a, b, statsCache.get(aFull), statsCache.get(bFull));
      });

    for (const entry of visibleEntries) {
      const fullPath = path.join(currentPath, entry.name);
      const relPath = path.relative(rootDir, fullPath);
      const stats = statsCache.get(fullPath) || fs.lstatSync(fullPath);
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

      if (showSize && stats.isDirectory() && !stats.isSymbolicLink()) {
        entryData.size = getDirSize(fullPath, ignores, showHidden, maxDepth, entryDepth, sizeCache);
      }

      if (!dirsOnly || entryData.isDirectory) {
        entries.push(entryData);
      }

      if (stats.isDirectory() && !stats.isSymbolicLink()) {
        visit(fullPath, entryDepth);
      }
    }
  }

  visit(rootDir, 0);
  return entries;
}


module.exports = {
  walkTree
};
