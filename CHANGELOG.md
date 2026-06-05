# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **Nerd Font icons**: Switched from Material Design Plane 15 codepoints (v3+ only) to Font Awesome BMP PUA codepoints, compatible with **all Nerd Font versions** (v2 and v3)
- **Windows clipboard crash**: ReferenceError on `--copy` due to undeclared variable `icons` (`bin/gofio-tree.js`)
- **Unreadable directories**: `walk.js` now wraps `readdirSync` in try/catch instead of crashing when permissions are denied
- **Path validation**: Proper error message when target is a file instead of a directory
- **README default icons**: Corrected from claiming Nerd Font default to actual emoji default

### Changed

- **Performance**: `lstatSync` calls halved by caching stats during sort phase, reused in main loop
- **Performance**: Directory sizes now cached in a Map, eliminating O(n²) recomputation with `--size --human`
- **ANSI colors**: Unified color definitions — `bin/gofio-tree.js` now imports `COLORS` from `src/constants.js` instead of maintaining a duplicate map
- **`NO_COLOR` handling**: Consolidated empty-string check across both modules
- **`--option=value` syntax**: Arguments like `--depth=2` or `--icons=emoji` now work alongside the space-separated form
- **New command `gotree`**: Added as primary command alongside existing `gofiols` alias — help text, README, and examples updated

## [0.1.3] - 2026-05-28

### Fixed

- **Windows clipboard**: Remove emojis from clipboard output to prevent corruption

## [0.1.2] - 2026-05-28

### Fixed

- **Windows clipboard**: Convert Unicode tree characters to ASCII when copying on Windows
  - Tree characters (`├│└─`) automatically converted to ASCII (`|+-`)
  - Emojis removed from clipboard output to prevent corruption
  - Terminal output still shows full Unicode, only clipboard is converted
  - Fixes garbled characters like `ÔööÔöÇÔöÇ` when pasting from Windows clipboard

## [0.1.1] - 2026-05-28

### Added

- **`--all` / `-a` flag**: Show all files including hidden files (`.gitignore`, `.env`, etc.) and ignored directories (`node_modules`, `dist`, `build`, `.next`, etc.)
- **`--copy` / `-c` flag**: Copy output to clipboard (automatically disables colors for clean text)
  - Windows: uses native `clip` command
  - macOS: uses native `pbcopy` command
  - Linux: tries `xclip`, `xsel`, or `wl-copy` (Wayland) with clear error message if not installed
- **`--dirs-only` flag**: Show directories only (no files)
- **`--depth` / `-d` flag**: Limit tree depth (e.g., `--depth 2`)
- **`--icons` flag**: Choose icon set: `nerd`, `emoji`, or `ascii`
- **`--no-color` flag**: Disable ANSI color output
- **`--size` / `-s` flag**: Show file sizes
- **`--human` / `-H` flag**: Show file sizes in human-readable format (B, KB, MB, GB)
  - Now shows sizes for **both files and directories** (directories show recursive total size)
- **`--help` / `-h` flag**: Show help message with usage examples
- **`--version` / `-v` flag**: Show version number
- **Automatic warning for `--all`**: Warns at the end when using `--all` that it displays thousands of files, suggests redirecting to file
- **Color support**: 256-color ANSI output with file type classification (JS, TS, CSS, HTML, JSON, images, videos, audio, configs, etc.)
- **Icon support**: 3 icon sets (emoji, nerd font, ascii) with file type detection
- **File type classification**: Different colors and icons for:
  - Directories, symlinks, test files, TypeScript, JavaScript, JSX/TSX, Vue, Svelte, Astro
  - CSS/SCSS/SASS, HTML, MD, JSON/YAML/TOML configs, images, videos, audio
  - Shell scripts, archives, Dockerfiles, lock files, hidden files
- **Sorting**: Directories first, then files, alphabetically within each group
- **Summary line**: Shows count of directories and files at the bottom

### Changed

- `--all` now shows **everything**: hidden files + ignored directories (`node_modules`, `dist`, etc.)
- `--copy` automatically enables `--no-color` for clean clipboard output
- Size display now includes directories with recursive total size when using `--size` or `--human`
- Warning messages appear at the **end** of output (so they don't get lost with large tree outputs)
- Error messages suppressed for clipboard commands (no more `/bin/sh: 1: xclip: not found`)

### Fixed

- Clipboard copy now works correctly on Windows/macOS/Linux with proper fallbacks
- ANSI codes no longer copied to clipboard (text is clean when using `--copy`)
- Warning for missing clipboard tools on Linux shows only once at the end

### Removed

- None
