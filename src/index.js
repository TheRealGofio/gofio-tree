const { walkTree } = require("./walk");
const { renderTree } = require("./render");

function gofioTree(targetPath, options = {}) {
  const entries = walkTree(targetPath, options);

  const summary = entries.reduce(
    (acc, entry) => {
      if (entry.isDirectory) {
        acc.directories += 1;
      } else {
        acc.files += 1;
      }
      return acc;
    },
    { directories: 0, files: 0 }
  );

  return renderTree(targetPath, entries, {
    ...options,
    summary
  });
}

module.exports = {
  gofioTree
};