# gofio-tree

A vibe-coded tool for learning purposes – CLI for rendering directory trees with icons and colors.

The package is published as `gofio-tree` and provides two commands:

```bash
gotree      # recommended
gofiols     # alias
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
| 🟨 | JavaScript files |
| 📘 | TypeScript files |
| ⚛️ | React/JSX/TSX/Vue/Svelte/Astro |
| 🎨 | CSS/SCSS/SASS/LESS/Stylus |
| 🌐 | HTML/MDX |
| ⚙️ | Config files (JSON, YAML, TOML, etc.) |
| 📄 | Markdown/Text |
| 🖼️ | Images (PNG, JPG, SVG, etc.) |
| 🎬 | Videos (MP4, WebM, MOV, etc.) |
| 🎵 | Audio (MP3, WAV, FLAC, etc.) |
| 📜 | Shell scripts (Bash, Zsh, Fish, etc.) |
| 📦 | Archives (ZIP, TAR, GZ, RAR, etc.) |
| 🧪 | Test files (*.spec, *.test) |
| 🐳 | Dockerfiles, docker-compose |
| 🔒 | Lock files (package-lock.json, yarn.lock, etc.) |
| 👻 | Hidden files (starting with `.`) |
| 📌 | Other files |
| 🔗 | Symlinks |

### Nerd Font icons

If you have a Nerd Font installed in your terminal (v2 or v3):

```bash
gotree . --icons nerd
```

### ASCII mode (no icons)

If icons don't render correctly:

```bash
gotree . --icons ascii
```

Example output:
