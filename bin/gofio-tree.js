#!/usr/bin/env node


const fs = require("node:fs");
const path = require("node:path");
const { gofioTree } = require("../src");
const packageJson = require("../package.json");


const args = process.argv.slice(2);


let inputPath = ".";
let maxDepth = 99;
let noColor = false;
let showHidden = false;
let dirsOnly = false;
let iconSet = "emoji";
let showSize = false;
let humanSize = false;
let copyToClipboard = false;


function printHelp() {
  console.log(`
gofiols ${packageJson.version}


Usage:
  gofiols [path] [options]


Options:
  -a, --all              Show all files including hidden and ignored (node_modules, dist, etc.)
  -c, --copy             Copy output to clipboard
  -d, --depth <number>   Limit tree depth
      --dirs-only        Show directories only
      --icons <set>      Icon set: nerd, emoji, ascii
      --no-color         Disable ANSI colors
  -h, --help             Show help
  -v, --version          Show version


Examples:
  gofiols
  gofiols .
  gofiols src --depth 2
  gofiols . --dirs-only
  gofiols . --icons emoji
  gofiols . --no-color
  gofiols . --all
  gofiols . --all --no-color > tree.txt
  gofiols . --copy
  gofiols . --all --copy
`.trim());
}


function copyToClipboardSync(text) {
  const platform = process.platform;
  const { execSync } = require("child_process");
  
  try {
    if (platform === "win32") {
      execSync("clip", { input: text, stdio: ["pipe", "ignore", "ignore"] });
      return true;
    } else if (platform === "darwin") {
      execSync("pbcopy", { input: text, stdio: ["pipe", "ignore", "ignore"] });
      return true;
    } else {
      try {
        execSync("xclip -selection clipboard", { input: text, stdio: ["pipe", "ignore", "ignore"] });
        return true;
      } catch {
        try {
          execSync("xsel --clipboard", { input: text, stdio: ["pipe", "ignore", "ignore"] });
          return true;
        } catch {
          try {
            execSync("wl-copy", { input: text, stdio: ["pipe", "ignore", "ignore"] });
            return true;
          } catch {
            return false;
          }
        }
      }
    }
  } catch (error) {
    return false;
  }
}


function ClipboardChecker() {
  const platform = process.platform;
  const { execSync } = require("child_process");
  
  try {
    if (platform === "win32") {
      execSync("clip", { input: "test", stdio: ["pipe", "ignore", "ignore"] });
      return true;
    } else if (platform === "darwin") {
      execSync("pbcopy", { input: "test", stdio: ["pipe", "ignore", "ignore"] });
      return true;
    } else {
      try {
        execSync("xclip -selection clipboard", { input: "test", stdio: ["pipe", "ignore", "ignore"] });
        return true;
      } catch {
        try {
          execSync("xsel --clipboard", { input: "test", stdio: ["pipe", "ignore", "ignore"] });
          return true;
        } catch {
          try {
            execSync("wl-copy", { input: "test", stdio: ["pipe", "ignore", "ignore"] });
            return true;
          } catch {
            return false;
          }
        }
      }
    }
  } catch {
    return false;
  }
}


for (let i = 0; i < args.length; i++) {
  const arg = args[i];


  if (arg === "--size" || arg === "-s") {
    showSize = true;
    continue;
  }


  if (arg === "--human" || arg === "-H") {
    showSize = true;
    humanSize = true;
    continue;
  }


  if (arg === "--help" || arg === "-h") {
    printHelp();
    process.exit(0);
  }


  if (arg === "--version" || arg === "-v") {
    console.log(packageJson.version);
    process.exit(0);
  }


  if (arg === "--no-color") {
    noColor = true;
    continue;
  }


  if (arg === "--copy" || arg === "-c") {
    copyToClipboard = true;
    noColor = true;
    continue;
  }


  if (arg === "--all" || arg === "-a") {
    showHidden = true;
    continue;
  }


  if (arg === "--dirs-only") {
    dirsOnly = true;
    continue;
  }


  if (arg === "--depth" || arg === "-d") {
    const value = args[i + 1];


    if (!value || Number.isNaN(Number(value))) {
      console.error("Invalid value for --depth");
      process.exit(1);
    }


    maxDepth = Number(value);
    i++;
    continue;
  }


  if (arg === "--icons") {
    const value = args[i + 1];


    if (!value || !["nerd", "emoji", "ascii"].includes(value)) {
      console.error("Invalid value for --icons. Use: nerd, emoji or ascii");
      process.exit(1);
    }


    iconSet = value;
    i++;
    continue;
  }


  if (!arg.startsWith("-")) {
    inputPath = arg;
    continue;
  }


  console.error(`Unknown option: ${arg}`);
  process.exit(1);
}


const targetPath = path.resolve(inputPath);


if (!fs.existsSync(targetPath)) {
  console.error(`Path does not exist: ${inputPath}`);
  process.exit(1);
}


const stats = fs.lstatSync(targetPath);


if (!stats.isDirectory()) {
  console.error(`Path is not a directory: ${inputPath}`);
  process.exit(1);
}


const output = gofioTree(targetPath, {
  maxDepth,
  noColor,
  showHidden,
  dirsOnly,
  icons: iconSet,
  showSize,
  humanSize
});


console.log(output);


// Warnings at the end (so they don't get lost with large output)
let clipboardSupported = true;

if (copyToClipboard) {
  const success = copyToClipboardSync(output);
  if (success) {
    console.error("\x1b[32m✓  Copied to clipboard\x1b[0m");
  } else {
    clipboardSupported = false;
  }
}


if (showHidden && process.stdout.isTTY) {
  console.error("\x1b[33m⚠️  Warning: --all displayed ALL files (including node_modules, dist, etc.).\x1b[0m");
  console.error("\x1b[33m   This can generate thousands of lines. For large outputs, consider:\x1b[0m");
  console.error("\x1b[33m   gofiols . --all --no-color > tree.txt\x1b[0m");
}


if (!clipboardSupported && process.platform === "linux") {
  console.error("\x1b[33m⚠️  Warning: --copy requires a clipboard tool on Linux.\x1b[0m");
  console.error("\x1b[33m   Install one of: xclip, xsel, or wl-copy (Wayland)\x1b[0m");
  console.error("\x1b[33m   Example: sudo apt install xclip\x1b[0m");
}