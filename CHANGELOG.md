# Changelog

## 1.2.0

### Added
- Gruvbox-inspired syntax palette with brand tinting (variables, keywords, strings stay readable)
- Language token modules: Python, JS/TS, Markdown, CSS, HTML, Shell, JSON, Go, Java, C/C#, Rust, YAML, Makefile, PowerShell
- Semantic token color map (37 LSP roles)
- GitLens (~68 keys), Jupyter (~14 keys), Error Lens (20 keys)
- Bracket pair colorization, diagnostics, merge conflicts, peek view, SCM graph, inlay hints
- Theme lint script (`npm run lint:themes`, `npm run check`)
- Examples workspace with multi-language preview samples
- ANSI terminal preview (`npm run preview:ansi`)
- Legacy aurora settings cleanup on extension activate

### Removed
- Aurora animated backgrounds and helper-extension wiring

### Changed
- Modular theme generator under `scripts/theme/`
- Status bar theme picker with color swatches and ↑↓ live preview

## 1.1.0

- Initial 48 brand themes (24 companies × dark/light)
- Status bar theme picker
- Experimental aurora backgrounds (later removed)
