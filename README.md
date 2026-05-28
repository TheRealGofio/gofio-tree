# gofio-tree

A vibe-coded tool for learning purposes – CLI for rendering directory trees with icons and colors.

The package is published as `gofio-tree` and the installed command is:

```bash
gofiols
```

## Installation

```bash
npm install -g gofio-tree
```

## Usage

```bash
gofiols
gofiols .
gofiols src --depth 2
gofiols . --all
gofiols . --dirs-only
gofiols . --size
gofiols . --human
gofiols . --icons emoji
gofiols . --icons nerd
gofiols . --icons ascii
gofiols . --no-color
gofiols . --copy
gofiols . --all --copy
gofiols . --all --no-color > tree.txt
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
gofiols

# Show tree of specific path
gofiols src

# Limit depth to 2 levels
gofiols . --depth 2

# Show only directories
gofiols . --dirs-only
```

### Show everything (including hidden and ignored)

```bash
# Show hidden files + node_modules + dist + everything
gofiols . --all

# Warning: this can generate thousands of lines!
gofiols . --all --no-color > tree.txt
```

### Show file sizes

```bash
# Show sizes in bytes
gofiols . --size

# Show sizes in human-readable format (includes directory totals)
gofiols . --human
gofiols . -H
```

### Copy to clipboard

```bash
# Copy tree to clipboard (clean text, no colors)
gofiols . --copy
gofiols . -c

# Copy full tree including node_modules
gofiols . --all --copy
```

### Different icon sets

```bash
# Emoji icons (default)
gofiols . --icons emoji

# Nerd Font icons (requires Nerd Font terminal)
gofiols . --icons nerd

# ASCII only (no icons, works everywhere)
gofiols . --icons ascii
```

### Disable colors

```bash
# For piping to files or when colors don't work
gofiols . --no-color
gofiols . --copy  # automatically disables colors
```

## Icons

By default, `gofiols` uses **emoji icons** with file type classification:

- 📁 Directories
- 🟨 JavaScript/TypeScript files
- 🟦 CSS/SCSS files
- 🟩 HTML/Markdown files
- 🟪 Config files (JSON, YAML, TOML, etc.)
- 🟧 Test files
- 🟥 Videos
- 🟨 Audio
- 🟫 Archives
- ⚙️ Package files
- 📌 Other files
- 📄 Default files
- 🔗 Symlinks
- 👁️ Hidden files

### Nerd Font icons

If you have a Nerd Font installed in your terminal:

```bash
gofiols . --icons nerd
```

### ASCII mode (no icons)

If icons don't render correctly:

```bash
gofiols . --icons ascii
```

## File Type Detection

`gofiols` automatically detects and colors/icons for:

- **Languages**: JavaScript, TypeScript, JSX, TSX, Vue, Svelte, Astro
- **Styles**: CSS, SCSS, SASS, LESS, Stylus
- **Markup**: HTML, MD, MDX
- **Config**: JSON, JSONC, YAML, YML, TOML, INI, ENV
- **Package**: package.json, yarn.lock, package-lock.json, pnpm-lock.yaml, Cargo.lock
- **Media**: PNG, JPG, GIF, SVG, MP4, WebM, MP3, WAV, etc.
- **Scripts**: SH, Bash, Zsh, Fish, PS1, Bat
- **Archives**: ZIP, TAR, GZ, RAR, 7Z
- **DevOps**: Dockerfile, docker-compose.yml, Makefile
- **Test**: *.spec.js, *.test.ts, etc.
- **Hidden**: Files starting with `.`

## License

ISC