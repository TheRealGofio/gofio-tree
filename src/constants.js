const COLORS = {
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  reset: "\x1b[0m",
  blue: "\x1b[38;5;75m",
  cyan: "\x1b[38;5;81m",
  green: "\x1b[38;5;114m",
  yellow: "\x1b[38;5;221m",
  orange: "\x1b[38;5;215m",
  red: "\x1b[38;5;203m",
  magenta: "\x1b[38;5;176m",
  purple: "\x1b[38;5;141m",
  gray: "\x1b[38;5;245m",
  white: "\x1b[38;5;255m"
};

const NERD_ICONS = {
  folder: "\u{f07b} ",
  js: "\u{f1c9} ",
  ts: "\u{f1c9} ",
  react: "\u{f1c9} ",
  style: "\u{f13c} ",
  html: "\u{f13b} ",
  config: "\u{f013} ",
  doc: "\u{f0f6} ",
  image: "\u{f1c5} ",
  video: "\u{f1c8} ",
  audio: "\u{f1c7} ",
  script: "\u{f120} ",
  archive: "\u{f1c6} ",
  test: "\u{f14a} ",
  docker: "\u{f21f} ",
  lock: "\u{f023} ",
  hidden: "\u{f070} ",
  misc: "\u{f15b} ",
  link: "\u{f0c1} "
};

const EMOJI_ICONS = {
  folder: "📁 ",
  js: "🟨 ",
  ts: "📘 ",
  react: "⚛️  ",
  style: "🎨 ",
  html: "🌐 ",
  config: "⚙️  ",
  doc: "📄 ",
  image: "🖼️  ",
  video: "🎬 ",
  audio: "🎵 ",
  script: "📜 ",
  archive: "📦 ",
  test: "🧪 ",
  docker: "🐳 ",
  lock: "🔒 ",
  hidden: "👻 ",
  misc: "📌 ",
  link: "🔗 "
};

const ASCII_ICONS = {
  folder: "[D] ",
  js: "[J] ",
  ts: "[T] ",
  react: "[R] ",
  style: "[S] ",
  html: "[H] ",
  config: "[C] ",
  doc: "[F] ",
  image: "[I] ",
  video: "[V] ",
  audio: "[A] ",
  script: "[X] ",
  archive: "[Z] ",
  test: "[*] ",
  docker: "[K] ",
  lock: "[L] ",
  hidden: "[.] ",
  misc: "[-] ",
  link: "[@] "
};

const DEFAULT_IGNORES = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".nuxt",
  ".svelte-kit",
  "out",
  "target",
  "vendor",
  ".turbo",
  ".cache"
]);

function getIcons(iconSet = "nerd") {
  if (iconSet === "emoji") return EMOJI_ICONS;
  if (iconSet === "ascii") return ASCII_ICONS;
  return NERD_ICONS;
}

module.exports = {
  COLORS,
  DEFAULT_IGNORES,
  getIcons
};