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

## What to look for

| File | Exercises |
|------|-----------|
| `typescript.ts` | Keywords, types, `this`, generics, decorators, regex, builtins |
| `python.py` | Decorators, async, docstrings, constants, f-strings |
| `markdown.md` | H1–H6 heading colors, code blocks, quotes, lists |
| `styles.css` | Selectors, properties, units, colors |
| `index.html` | Tags, attributes, embedded script/style |
| `data.json` | Strings, numbers, keys |
| `terminal.sh` | Shell keywords, variables, strings |

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
