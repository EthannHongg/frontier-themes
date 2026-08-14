# Frontier Themes — Examples

Sample files to preview syntax highlighting, semantic tokens, and language-specific rules from the theme generator.

## Quick start

1. Open this folder in Cursor/VS Code:
   ```bash
   code examples
   # or: cursor examples
   ```
2. Install **Frontier Themes** if you haven't already.
3. Pick a theme:
   - Status bar → color icon → choose e.g. **OpenAI Dark**
   - Or `Ctrl+K Ctrl+T` → Color Theme
4. Open the sample files below (or run **File → Open Workspace from File** → `examples.code-workspace`).

## Terminal ANSI colors

Gruvbox does **not** ship a special README command for terminal colors. Their workflow is: open `code-examples/` in an Extension Development Host (**F5**) and eyeball syntax + terminal side by side.

For Frontier, run this **inside the Cursor/VS Code integrated terminal** (`` Ctrl+` ``) with a Frontier theme active:

```bash
npm run preview:ansi
```

Or: `node scripts/preview-ansi.mjs`

Colors only match your theme in the **editor terminal** — an external PowerShell/cmd window uses its own palette.

## Editor syntax demo (Gruvbox-style)

1. Open `examples/examples.code-workspace`
2. Press **F5** to launch Extension Development Host (or install the VSIX)
3. Pick a theme (status bar picker or `Ctrl+K Ctrl+T`)
4. Open sample files from the table below
5. **Ctrl+Shift+P** → `Developer: Inspect Editor Tokens and Scopes` on any token
6. Toggle themes with **↑↓** in the status bar picker to compare brands live

## What to look for

| File | Exercises |
|------|-----------|
| `typescript.ts` | Keywords, types, `this`, generics, decorators, regex, builtins |
| `python.py` | Decorators, async, docstrings, constants, f-strings, ALL_CAPS |
| `main.go` | Packages, imports, structs, interfaces, methods |
| `main.rs` | Traits, macros, attributes, `self`, constants |
| `main.c` | Preprocessor, structs, functions, C99 builtins |
| `ThemeEntry.java` | Imports, annotations, records, javadoc |
| `Makefile` | Targets, prerequisites, recipes |
| `preview-theme.ps1` | Cmdlets, attributes, hashtables, parameters |
| `config.yaml` | Keys, lists, booleans, nested mappings |
| `markdown.md` | H1–H6 heading colors, code blocks, quotes, lists |
| `styles.css` | Selectors, properties, units, colors |
| `index.html` | Tags, attributes, embedded script/style |
| `data.json` | Property names, strings, numbers, booleans |
| `terminal.sh` | Shell script syntax (keywords, strings, variables) |
| `preview-ansi.sh` | 16-color ANSI swatch in integrated terminal |

## Compare themes quickly

1. Status bar → **Frontier Themes** picker
2. Use **↑ / ↓** to live-preview themes without applying
3. **Enter** to keep, **Esc** to revert

Try pairs like **OpenAI Dark** vs **Anthropic Dark**, or **Google Light** vs **Linear Light**.

## Bracket pairs & diagnostics

Open `typescript.ts` and:

- Enable **Bracket Pair Colorization** (on by default in recent VS Code)
- Introduce a typo or type error to see `editorError` / squiggle colors
- Use **Cmd/Ctrl+Shift+P** → "Developer: Inspect Editor Tokens and Scopes" on any token

## Error Lens (optional extension)

If you use [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens), add to settings:

```json
"errorLens.useColorContributions": true
```

Inline error/warning/info/hint colors are themed to match each brand palette.
