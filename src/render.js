const path = require("node:path");
const { COLORS, getIcons } = require("./constants");


function getColors(noColor) {
  const envNoColor =
    typeof process !== "undefined" &&
    process.env &&
    process.env.NO_COLOR &&
    process.env.NO_COLOR !== "";


  if (noColor || envNoColor) {
    return {
      bold: "",
      dim: "",
      reset: "",
      blue: "",
      cyan: "",
      green: "",
      yellow: "",
      orange: "",
      red: "",
      magenta: "",
      purple: "",
      gray: "",
      white: ""
    };
  }


  return COLORS;
}


function formatSize(bytes, humanReadable) {
  if (!humanReadable) {
    return `${bytes} B`;
  }


  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;


  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }


  const formatted =
    value >= 10 || unitIndex === 0
      ? Math.round(value).toString()
      : value.toFixed(1);


  return `${formatted} ${units[unitIndex]}`;
}


function classify(name, entry, colors, icons) {
  if (entry.isSymlink) {
    return { color: colors.cyan, icon: icons.link, suffix: "" };
  }


  if (entry.isDirectory) {
    return { color: colors.bold + colors.blue, icon: icons.folder, suffix: "/" };
  }


  if (/\.(spec|test)\.(js|ts|jsx|tsx)$/i.test(name)) {
    return { color: colors.bold + colors.orange, icon: icons.test, suffix: "" };
  }


  if (/\.(ts|mts|cts)$/i.test(name)) {
    return { color: colors.yellow, icon: icons.ts, suffix: "" };
  }


  if (/\.(js|mjs|cjs)$/i.test(name)) {
    return { color: colors.yellow, icon: icons.js, suffix: "" };
  }


  if (/\.(jsx|tsx)$/i.test(name)) {
    return { color: colors.magenta, icon: icons.react, suffix: "" };
  }


  if (/\.(vue)$/i.test(name)) {
    return { color: colors.green, icon: icons.vue, suffix: "" };
  }


  if (/\.(svelte)$/i.test(name)) {
    return { color: colors.orange, icon: icons.svelte, suffix: "" };
  }


  if (/\.(astro)$/i.test(name)) {
    return { color: colors.magenta, icon: icons.astro, suffix: "" };
  }


  if (/\.(css|scss|sass|less|styl)$/i.test(name)) {
    return { color: colors.purple, icon: icons.style, suffix: "" };
  }


  if (/\.(html|htm|mdx)$/i.test(name)) {
    return { color: colors.cyan, icon: icons.html, suffix: "" };
  }


  if (/\.(ejs|pug|jade|hbs|handlebars|liquid|njk|mustache)$/i.test(name)) {
    return { color: colors.cyan, icon: icons.template, suffix: "" };
  }


  if (/\.(php|phtml)$/i.test(name)) {
    return { color: colors.purple, icon: icons.php, suffix: "" };
  }


  if (/\.(graphql|gql)$/i.test(name)) {
    return { color: colors.magenta, icon: icons.graphql, suffix: "" };
  }


  if (/\.(py|pyw|pyx)$/i.test(name) || /^(requirements\.txt|Pipfile|setup\.py)$/i.test(name)) {
    return { color: colors.blue, icon: icons.python, suffix: "" };
  }


  if (/\.(go)$/i.test(name) || /^(go\.mod|go\.sum)$/i.test(name)) {
    return { color: colors.cyan, icon: icons.go, suffix: "" };
  }


  if (/\.(rs)$/i.test(name) || /^(Cargo\.toml)$/i.test(name)) {
    return { color: colors.orange, icon: icons.rust, suffix: "" };
  }


  if (/\.(rb|erb)$/i.test(name) || /^(Gemfile|Rakefile)$/i.test(name)) {
    return { color: colors.red, icon: icons.ruby, suffix: "" };
  }


  if (/\.(sql|prisma|drizzle)$/i.test(name) || /\.(db|sqlite|duckdb)$/i.test(name)) {
    return { color: colors.purple, icon: icons.database, suffix: "" };
  }


  if (/^\.env/.test(name)) {
    return { color: colors.yellow, icon: icons.env, suffix: "" };
  }


  // Lock files before config (package-lock.json ends in .json)
  if (/^(yarn\.lock|package-lock\.json|pnpm-lock\.yaml|bun\.lockb|Cargo\.lock|composer\.lock|Gemfile\.lock)$/i.test(name)) {
    return { color: colors.bold + colors.white, icon: icons.lock, suffix: "" };
  }


  // Docker before config (docker-compose.yml ends in .yml)
  if (/^(Dockerfile|docker-compose\.ya?ml|\.dockerignore|Makefile|Justfile)$/i.test(name)) {
    return { color: colors.bold + colors.blue, icon: icons.docker, suffix: "" };
  }


  // Serverless before config (vercel.json ends in .json)
  if (/^(serverless\.ya?ml|netlify\.toml|vercel\.json|now\.json)$/i.test(name)) {
    return { color: colors.bold + colors.blue, icon: icons.serverless, suffix: "" };
  }


  if (
    /\.(json|jsonc|yaml|yml|toml|ini|conf)$/i.test(name) ||
    /^(\.eslintrc|\.prettierrc|eslint\.config|prettier\.config|tsconfig\.json|tailwind\.config|postcss\.config|stylelint\.config|commitlint\.config|lint-staged\.config|playwright\.config|cypress\.config|vite\.config|webpack\.config|rollup\.config|vitest\.config|jest\.config|next\.config|nuxt\.config|svelte\.config|astro\.config|remix\.config|gatsby\.config)/i.test(name)
  ) {
    return { color: colors.bold + colors.green, icon: icons.config, suffix: "" };
  }


  if (/\.(md|txt|rst|adoc)$/i.test(name)) {
    return { color: colors.green, icon: icons.doc, suffix: "" };
  }


  if (/\.(png|jpg|jpeg|gif|webp|avif|svg|ico|bmp|tiff|woff|woff2|ttf|otf|eot)$/i.test(name)) {
    return { color: colors.cyan, icon: icons.image, suffix: "" };
  }


  if (/\.(mp4|webm|mov|mkv|avi|vtt)$/i.test(name)) {
    return { color: colors.red, icon: icons.video, suffix: "" };
  }


  if (/\.(mp3|wav|ogg|flac|aac|m4a)$/i.test(name)) {
    return { color: colors.orange, icon: icons.audio, suffix: "" };
  }


  if (/\.(sh|bash|zsh|fish|ps1|bat|patch)$/i.test(name)) {
    return { color: colors.bold + colors.red, icon: icons.script, suffix: "" };
  }


  if (/\.(gz|zip|tar|rar|7z|xz|bz2)$/i.test(name)) {
    return { color: colors.red, icon: icons.archive, suffix: "" };
  }


  if (/^\./.test(name)) {
    return { color: colors.gray, icon: icons.hidden, suffix: "" };
  }


  return { color: colors.dim, icon: icons.misc, suffix: "" };
}


function getParent(relPath) {
  return relPath === "." ? "." : path.dirname(relPath);
}

function renderTree(rootDir, entries, options = {}) {
  const colors = getColors(options.noColor);
  const icons = getIcons(options.icons);
  const showSize = options.showSize ?? false;
  const humanSize = options.humanSize ?? false;


  const childCount = new Map();
  const childIndex = new Map();
  const prefixCache = new Map();

  for (const entry of entries) {
    const parent = getParent(entry.relPath);
    childCount.set(parent, (childCount.get(parent) ?? 0) + 1);
  }

  const lines = [];
  lines.push("");
  lines.push(`  ${colors.bold}${colors.cyan}${path.basename(rootDir)}${colors.reset}`);
  lines.push("");


  for (const entry of entries) {
    const parent = getParent(entry.relPath);
    const name = entry.name;

    childIndex.set(parent, (childIndex.get(parent) ?? 0) + 1);
    const idx = childIndex.get(parent);
    const total = childCount.get(parent) ?? 0;
    const connector = idx === total ? "└── " : "├── ";

    const prefix = (() => {
      let result = "";
      let current = parent;
      while (current !== "." && current !== "") {
        const grandParent = getParent(current);
        const grandIdx = childIndex.get(grandParent) ?? 0;
        const grandTotal = childCount.get(grandParent) ?? 0;
        result = (grandIdx < grandTotal ? "│   " : "    ") + result;
        current = grandParent;
      }
      return result;
    })();

    const style = classify(name, entry, colors, icons);

    const sizeLabel =
      showSize && entry.size > 0
        ? ` ${colors.dim}(${formatSize(entry.size, humanSize)})${colors.reset}`
        : "";

    lines.push(
      `  ${prefix}${connector}${style.color}${style.icon}${name}${style.suffix}${colors.reset}${sizeLabel}`
    );
  }


  if (options.summary) {
    const { directories, files } = options.summary;
    const dirLabel = directories === 1 ? "directory" : "directories";
    const fileLabel = files === 1 ? "file" : "files";

    lines.push("");
    lines.push(`  ${colors.dim}${directories} ${dirLabel}, ${files} ${fileLabel}${colors.reset}`);
  }


  lines.push("");
  return lines.join("\n");
}


module.exports = {
  renderTree
};