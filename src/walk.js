const fs = require("node:fs");
const path = require("node:path");
const { DEFAULT_IGNORES } = require("./constants");


function getDirSize(dirPath, ignores, showHidden, maxDepth, currentDepth) {
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
        // Recurse into subdirectory (if within depth limit)
        totalSize += getDirSize(fullPath, ignores, showHidden, maxDepth, currentDepth + 1);
      } else {
        totalSize += stats.size;
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }
  
  return totalSize;
}


function walkTree(rootDir, options = {}) {
  const maxDepth = options.maxDepth ?? 99;
  const showHidden = options.showHidden ?? false;
  const dirsOnly = options.dirsOnly ?? false;
  const showSize = options.showSize ?? false;
  const ignores = showHidden ? new Set() : (options.ignores ?? DEFAULT_IGNORES);
  const entries = [];


  function visit(currentPath, currentDepth) {
    if (currentDepth > maxDepth) return;


    const dirEntries = fs.readdirSync(currentPath, { withFileTypes: true });


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
        const aDir = fs.lstatSync(aFull).isDirectory();
        const bDir = fs.lstatSync(bFull).isDirectory();


        if (aDir && !bDir) return -1;
        if (!aDir && bDir) return 1;
        return a.name.localeCompare(b.name);
      });


    for (const entry of visibleEntries) {
      const fullPath = path.join(currentPath, entry.name);
      const relPath = path.relative(rootDir, fullPath);
      const stats = fs.lstatSync(fullPath);
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


      // Calculate directory size recursively if showSize is true and it's a directory
      if (showSize && stats.isDirectory() && !stats.isSymbolicLink()) {
        entryData.size = getDirSize(fullPath, ignores, showHidden, maxDepth, entryDepth);
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