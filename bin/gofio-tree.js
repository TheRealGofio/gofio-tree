#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { gofioTree } = require("../src");
const { COLORS } = require("../src/constants");
const packageJson = require("../package.json");


const args = process.argv.slice(2);


// Define all options in one place (autodocumentation)
const OPTIONS = [
  { flags: ["-a", "--all"], arg: false, desc: "Show all files including hidden and ignored (node_modules, dist, etc.)" },
  { flags: ["-c", "--copy"], arg: false, desc: "Copy output to clipboard (auto-disables colors)" },
  { flags: ["-d", "--depth"], arg: true, desc: "Limit tree depth", placeholder: "<number>" },
  { flags: ["--dirs-only"], arg: false, desc: "Show directories only" },
  { flags: ["--icons"], arg: true, desc: "Icon set", placeholder: "<set>", values: ["emoji", "nerd", "ascii"] },
  { flags: ["--no-color"], arg: false, desc: "Disable ANSI colors" },
  { flags: ["-s", "--size"], arg: false, desc: "Show file sizes in bytes" },
  { flags: ["-H", "--human"], arg: false, desc: "Show file sizes in human-readable format (B, KB, MB, GB)" },
  { flags: ["-h", "--help"], arg: false, desc: "Show help message" },
  { flags: ["-v", "--version"], arg: false, desc: "Show version" }
];


// Initialize options state
let inputPath = ".";
let maxDepth = 99;
let noColor = false;
let showHidden = false;
let dirsOnly = false;
let iconSet = "emoji";
let showSize = false;
let humanSize = false;
let copyToClipboard = false;


function getColor(name, noColorFlag) {
  if (noColorFlag || (process.env.NO_COLOR && process.env.NO_COLOR !== "")) return "";
  return COLORS[name] || "";
}


function printHelp() {
  const c = {
    reset: getColor("reset", false),
    bold: getColor("bold", false),
    dim: getColor("dim", false),
    cyan: getColor("cyan", false),
    green: getColor("green", false),
    yellow: getColor("yellow", false),
    blue: getColor("blue", false),
    magenta: getColor("magenta", false),
    gray: getColor("gray", false)
  };


  // Generate options table from OPTIONS array
  const maxFlagLength = OPTIONS.reduce((max, opt) => {
    const flagStr = opt.flags.join(", ");
    return Math.max(max, flagStr.length);
  }, 0);


  const optionsLines = OPTIONS.map(opt => {
    const flagStr = opt.flags.join(", ");
    const padding = " ".repeat(maxFlagLength - flagStr.length + 2);
    const argPart = opt.arg ? `${c.yellow}${opt.placeholder}${c.reset}` : "";
    const descPart = opt.values 
      ? `${c.dim}${opt.desc}: ${c.yellow}${opt.values.join(", ")}${c.reset}`
      : c.dim + opt.desc + c.reset;
    
    return `  ${c.magenta}${flagStr}${c.reset}${padding}${argPart}${descPart}`;
  }).join("\n");


  const helpText = `
${c.bold}${c.cyan}gotree${c.reset} ${packageJson.version}
${c.dim}A vibe-coded tool for learning purposes${c.reset}

${c.bold}Usage:${c.reset}
  ${c.green}gotree${c.reset} ${c.dim}[path]${c.reset} ${c.dim}[options]${c.reset}

${c.bold}Options:${c.reset}
${optionsLines}

${c.bold}Examples:${c.reset}
  ${c.green}gotree${c.reset}                    ${c.dim}# Current directory${c.reset}
  ${c.green}gotree${c.reset} ${c.dim}.${c.reset}                  ${c.dim}# Explicit path${c.reset}
  ${c.green}gotree${c.reset} ${c.dim}src --depth 2${c.reset}      ${c.dim}# Limit depth${c.reset}
  ${c.green}gotree${c.reset} ${c.dim}--all${c.reset}              ${c.dim}# Show everything${c.reset}
  ${c.green}gotree${c.reset} ${c.dim}--human${c.reset}            ${c.dim}# Human-readable sizes${c.reset}
  ${c.green}gotree${c.reset} ${c.dim}--copy${c.reset}             ${c.dim}# Copy to clipboard${c.reset}
  ${c.green}gotree${c.reset} ${c.dim}--icons nerd${c.reset}       ${c.dim}# Nerd Font icons${c.reset}
  ${c.green}gotree${c.reset} ${c.dim}--no-color > tree.txt${c.reset}  ${c.dim}# Save to file${c.reset}

${c.dim}Published as${c.reset} ${c.yellow}gofio-tree${c.dim} on npm — commands:${c.reset} ${c.cyan}gotree${c.dim} (recommended) /${c.reset} ${c.cyan}gofiols${c.dim} (alias)${c.reset}
`.trim();


  console.log(helpText);
}


function copyToClipboardSync(text) {
  const platform = process.platform;
  const { execSync } = require("child_process");
  
  // Convert Unicode tree characters to ASCII on Windows
  if (platform === "win32") {
    iconSet = 'ascii';
    text = text.replace(/[├│└─┌┐]/g, (char) => {
      const treeMap = {
        '├': '|',
        '│': '|',
        '└': '+',
        '─': '-',
        '┌': '+',
        '┐': '+'
      };
      return treeMap[char] || char;
    });
    
    // Remove emojis (they don't work well in Windows clipboard)
    text = text.replace(/[\p{Emoji}\u{1F300}-\u{1F9FF}]/gu, '');
  }
  
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

// Map flags to variable names and handlers
const flagHandlers = {
  "--all": () => { showHidden = true; },
  "-a": () => { showHidden = true; },
  "--copy": () => { copyToClipboard = true; noColor = true; },
  "-c": () => { copyToClipboard = true; noColor = true; },
  "--depth": (value) => { 
    if (!value || Number.isNaN(Number(value))) {
      console.error(`${COLORS.yellow}Invalid value for --depth${COLORS.reset}`);
      process.exit(1);
    }
    maxDepth = Number(value); 
  },
  "-d": (value) => { 
    if (!value || Number.isNaN(Number(value))) {
      console.error(`${COLORS.yellow}Invalid value for --depth${COLORS.reset}`);
      process.exit(1);
    }
    maxDepth = Number(value); 
  },
  "--dirs-only": () => { dirsOnly = true; },
  "--icons": (value) => {
    if (!value || !["nerd", "emoji", "ascii"].includes(value)) {
      console.error(`${COLORS.yellow}Invalid value for --icons. Use: nerd, emoji or ascii${COLORS.reset}`);
      process.exit(1);
    }
    iconSet = value;
  },
  "--no-color": () => { noColor = true; },
  "--size": () => { showSize = true; },
  "-s": () => { showSize = true; },
  "--human": () => { showSize = true; humanSize = true; },
  "-H": () => { showSize = true; humanSize = true; },
  "--help": () => { printHelp(); process.exit(0); },
  "-h": () => { printHelp(); process.exit(0); },
  "--version": () => { console.log(packageJson.version); process.exit(0); },
  "-v": () => { console.log(packageJson.version); process.exit(0); }
};


for (let i = 0; i < args.length; i++) {
  let arg = args[i];
  let value;

  const eqIdx = arg.indexOf("=");
  if (eqIdx > 1 && arg.startsWith("--")) {
    value = arg.slice(eqIdx + 1);
    arg = arg.slice(0, eqIdx);
  }

  if (flagHandlers[arg]) {
    const opt = OPTIONS.find(o => o.flags.includes(arg));
    if (opt && opt.arg) {
      if (value === undefined) {
        value = args[i + 1];
        i++;
      }
      flagHandlers[arg](value);
    } else {
      flagHandlers[arg]();
    }
    continue;
  }


  if (!arg.startsWith("-")) {
    inputPath = arg;
    continue;
  }


  console.error(`${COLORS.yellow}Unknown option: ${arg}${COLORS.reset}`);
  process.exit(1);
}


const targetPath = path.resolve(inputPath);


if (!fs.existsSync(targetPath)) {
  console.error(`${COLORS.yellow}Path does not exist: ${inputPath}${COLORS.reset}`);
  process.exit(1);
}


const stats = fs.lstatSync(targetPath);


if (!stats.isDirectory()) {
  console.error(`${COLORS.yellow}Path is not a directory: ${inputPath}${COLORS.reset}`);
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
    console.error(`${COLORS.green}✓  Copied to clipboard${COLORS.reset}`);
  } else {
    clipboardSupported = false;
  }
}


if (showHidden && process.stdout.isTTY) {
  console.error(`${COLORS.yellow}⚠️  Warning: --all displayed ALL files (including node_modules, dist, etc.)${COLORS.reset}`);
  console.error(`${COLORS.yellow}   This can generate thousands of lines. For large outputs, consider:${COLORS.reset}`);
  console.error(`${COLORS.yellow}   gotree . --all --no-color > tree.txt${COLORS.reset}`);
}


if (!clipboardSupported && process.platform === "linux") {
  console.error(`${COLORS.yellow}⚠️  Warning: --copy requires a clipboard tool on Linux${COLORS.reset}`);
  console.error(`${COLORS.yellow}   Install one of: xclip, xsel, or wl-copy (Wayland)${COLORS.reset}`);
  console.error(`${COLORS.yellow}   Example: sudo apt install xclip${COLORS.reset}`);
}