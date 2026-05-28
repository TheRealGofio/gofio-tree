# gofio-tree

A CLI for rendering directory trees with icons and colors.

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
gofiols . --no-color
```

## Options

- `-a, --all`: show hidden files and directories.
- `-d, --depth <number>`: limit tree depth.
- `-s, --size`: show file sizes in bytes.
- `-H, --human`: show file sizes in human-readable format.
- `--dirs-only`: show directories only.
- `--icons <set>`: icon set, one of `emoji`, `nerd`, `ascii`.
- `--no-color`: disable ANSI colors.
- `-h, --help`: show help.
- `-v, --version`: show version.

## Icons

By default, `gofiols` uses emoji icons.

If you prefer Nerd Font icons:

```bash
gofiols . --icons nerd
```

If your terminal does not render some icons correctly, you can use:

```bash
gofiols . --icons ascii
```

## License

ISC