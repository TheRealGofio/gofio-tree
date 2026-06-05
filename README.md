# gofio-tree

A vibe-coded tool for learning purposes – CLI for rendering directory trees with icons and colors.

The package is published as `gofio-tree` and provides two commands:

```bash
gotree      # recommended
gofiols     # alias
```

Set the default icon set via the `GOTREE_ICONS` environment variable:
```bash
export GOTREE_ICONS=nerd   # in .bashrc, .zshrc, etc.
gotree .                   # uses Nerd Font icons without --icons nerd
```

## Installation

```bash
npm install -g gofio-tree
```

## Usage

```bash
gotree
gotree .
gotree src --depth 2
gotree . --all
gotree . --dirs-only
gotree . --size
gotree . --human
gotree . --icons emoji
gotree . --icons nerd
gotree . --icons ascii
gotree . --no-color
gotree . --copy
gotree . --all --copy
gotree . --all --no-color > tree.txt
gotree . --sort size
gotree . --sort mtime --reverse
gotree . --no-gitignore
```

## Options

| Option | Alias | Description |
|--------|-------|-------------|
| `-a, --all` | `-a` | Show hidden files and **all** directories (including `node_modules`, `dist`, `build`, etc.) |
| `-c, --copy` | `-c` | Copy output to clipboard (automatically disables colors) |
| `-d, --depth` | `-d` | Limit tree depth (e.g., `--depth 2`) |
| `-s, --size` | `-s` | Show file sizes in bytes |
| `-H, --human` | `-H` | Show file sizes in human-readable format (B, KB, MB, GB) – includes directory sizes |
| `--dirs-only` | | Show directories only (no files) |
| `--icons` | | Icon set: `emoji` (default), `nerd`, or `ascii` |
| `--no-color` | | Disable ANSI colors |
| `GOTREE_ICONS` | *(env)* | Default icon set: `nerd`, `emoji`, or `ascii` (overridable by `--icons`) |
| `--no-gitignore` | | Disable `.gitignore` rules (ignored files are shown) |
| `--sort` | | Sort entries by `name`, `size`, or `mtime` (default: `name`) |
| `-r, --reverse` | `-r` | Reverse sort order |
| `-h, --help` | `-h` | Show help message |
| `-v, --version` | `-v` | Show version |

## Examples

### Basic usage

```bash
# Show tree of current directory
gotree

# Show tree of specific path
gotree src

# Limit depth to 2 levels
gotree . --depth 2

# Show only directories
gotree . --dirs-only
```

### Show everything (including hidden and ignored)

```bash
# Show hidden files + node_modules + dist + everything
gotree . --all

# Warning: this can generate thousands of lines!
gotree . --all --no-color > tree.txt
```

### Show file sizes

```bash
# Show sizes in bytes
gotree . --size

# Show sizes in human-readable format (includes directory totals)
gotree . --human
gotree . -H
```

### Copy to clipboard

```bash
# Copy tree to clipboard (clean text, no colors)
gotree . --copy
gotree . -c

# Copy full tree including node_modules
gotree . --all --copy

# On Windows, use ASCII icons for better clipboard compatibility
gotree . --icons ascii --copy
```

### Different icon sets

```bash
# Emoji icons (recommended)
gotree . --icons emoji

# Nerd Font icons (requires Nerd Font terminal)
gotree . --icons nerd

# ASCII only (no icons, works everywhere, good for Windows)
gotree . --icons ascii
```

### Disable colors

```bash
# For piping to files or when colors don't work
gotree . --no-color
gotree . --copy  # automatically disables colors
```

## Icons

By default, `gotree` uses **emoji icons**. You can switch to Nerd Font icons with `--icons nerd` if you have a Nerd Font installed in your terminal.

### Emoji icons (recommended)

```bash
gotree . --icons emoji
```

Icon mapping:

| Icon | Type |
|------|------|
| 📁 | Directories |
| 🟨 | JavaScript (.js, .mjs, .cjs) |
| 📘 | TypeScript (.ts, .mts, .cts) |
| ⚛️ | JSX/TSX (React) |
| 💚 | Vue (.vue) |
| 🧡 | Svelte (.svelte) |
| 🚀 | Astro (.astro) |
| 🎨 | Stylesheets (CSS, SCSS, LESS, Stylus) |
| 🌐 | HTML/MDX |
| 📋 | Templates (EJS, Pug, Handlebars, Liquid, Nunjucks) |
| 🐘 | PHP |
| ◈ | GraphQL (.graphql, .gql) |
| 🐍 | Python (.py, requirements.txt, Pipfile) |
| 🔷 | Go (.go, go.mod, go.sum) |
| 🦀 | Rust (.rs, Cargo.toml) |
| 💎 | Ruby (.rb, Gemfile, Rakefile) |
| 🗄️ | Database (SQL, Prisma, Drizzle, SQLite) |
| 🔧 | Environment files (.env, .env.*) |
| ⚙️ | Config files (JSON, YAML, TOML, INI, etc.) |
| ☁️ | Serverless (serverless.yml, vercel.json, netlify.toml) |
| 📄 | Documents (Markdown, text, RST, AsciiDoc) |
| 🖼️ | Images (PNG, JPG, SVG, GIF, WebP, fonts) |
| 🎬 | Videos (MP4, WebM, MOV, AVI, MKV) |
| 🎵 | Audio (MP3, WAV, OGG, FLAC, AAC) |
| 📜 | Shell scripts (Bash, Zsh, Fish, PowerShell) |
| 📦 | Archives (ZIP, TAR, GZ, RAR, 7z) |
| 🐳 | Docker / Make / Just |
| 🔒 | Lock files (package-lock, yarn.lock, Cargo.lock, etc.) |
| 🧪 | Test files — detected **before** language type |
| 👻 | Hidden files (starting with `.`) |
| 📌 | Other files |
| 🔗 | Symlinks |

> **Classification priority**: Test files (`*.spec.*`, `*.test.*`) take precedence over language-specific icons. A file like `Component.test.tsx` shows the test icon (🧪/) rather than the React icon. This ensures tests are visually identifiable regardless of their source language.

### Nerd Font icons

If you have a Nerd Font installed in your terminal (v2 or v3):

```bash
gotree . --icons nerd
```

Icon mapping (codepoints from Devicons and Font Awesome, all in BMP PUA range):

| Icon | Codepoint | Type |
|------|-----------|------|
|  | `\u{f07b}` | Directories |
|  | `\u{e781}` | JavaScript (.js, .mjs, .cjs) |
|  | `\u{e8ca}` | TypeScript (.ts, .mts, .cts) |
|  | `\u{e7ba}` | JSX/TSX (React) |
|  | `\u{e8dc}` | Vue (.vue) |
|  | `\u{e8b7}` | Svelte (.svelte) |
|  | `\u{e735}` | Astro (.astro) |
|  | `\u{f13c}` | Stylesheets (CSS, SCSS, LESS, Stylus) |
|  | `\u{f13b}` | HTML/MDX |
|  | `\u{f1c9}` | Templates (EJS, Pug, Handlebars, Liquid, Nunjucks) |
|  | `\u{e73d}` | PHP |
|  | `\u{e7f4}` | GraphQL (.graphql, .gql) |
|  | `\u{e73c}` | Python (.py, requirements.txt, Pipfile) |
|  | `\u{e724}` | Go (.go, go.mod, go.sum) |
|  | `\u{e7a8}` | Rust (.rs, Cargo.toml) |
|  | `\u{e739}` | Ruby (.rb, Gemfile, Rakefile) |
|  | `\u{f1c0}` | Database (SQL, Prisma, Drizzle, SQLite) |
|  | `\u{f013}` | Config files (JSON, YAML, TOML, INI, etc.) |
|  | `\u{f0c2}` | Serverless (serverless.yml, vercel.json, netlify.toml) |
|  | `\u{f0f6}` | Documents (Markdown, text, RST, AsciiDoc) |
|  | `\u{f1c5}` | Images (PNG, JPG, SVG, GIF, WebP, fonts) |
|  | `\u{f1c8}` | Videos (MP4, WebM, MOV, AVI, MKV) |
|  | `\u{f1c7}` | Audio (MP3, WAV, OGG, FLAC, AAC) |
|  | `\u{f120}` | Shell scripts (Bash, Zsh, Fish, PowerShell) |
|  | `\u{f1c6}` | Archives (ZIP, TAR, GZ, RAR, 7z) |
|  | `\u{e7b0}` | Docker / Make / Just |
|  | `\u{f023}` | Lock files (package-lock, yarn.lock, Cargo.lock, etc.) |
|  | `\u{f14a}` | Test files — detected **before** language type |
|  | `\u{f070}` | Hidden files (starting with `.`) |
|  | `\u{f15b}` | Other files |
|  | `\u{f0c1}` | Symlinks |

### ASCII mode (no icons)

If icons don't render correctly:

```bash
gotree . --icons ascii
```

Example output:
