# Brand Themes

**48 editor color themes** inspired by top tech companies and AI startups — for **VS Code** and **Cursor**. Each brand has light and dark variants, plus an optional **animated aurora background** tuned to that brand's palette.

![Brand Themes](media/banner.png)

## Themes included

### Big Tech (12 brands × 2 modes)

Google · Apple · Meta · Amazon · Netflix · Microsoft · NVIDIA · Tesla · SpaceX · Salesforce · Adobe · IBM

### AI & Startups (12 brands × 2 modes)

OpenAI · Anthropic · Perplexity · Cursor · Mistral · Cohere · Stability AI · Hugging Face · Replicate · Vercel · Linear · Figma

## Install

### From VSIX (local / Cursor)

```bash
# In this repo
npm install
npm run generate
npm run package
```

Then in VS Code or Cursor:

1. Extensions panel → `...` menu → **Install from VSIX**
2. Select `brand-themes-1.0.0.vsix`

### From Marketplace (after publish)

Search **Brand Themes** in the Extensions panel.

### From source (development)

```bash
git clone https://github.com/EthannHongg/brand-themes.git
cd brand-themes
npm install
npm run generate
```

Then press **F5** in VS Code to launch an Extension Development Host, or symlink/copy the folder into your extensions directory.

## Quick start

1. **Pick a theme** — click the **color icon** in the status bar (bottom-right), or run **Brand Themes: Pick Theme** from the Command Palette (`Ctrl+Shift+P`).
2. **Optional aurora** — click **Aurora Off** in the status bar to enable a brand-matched animated background.

Themes are also available under **Preferences → Color Theme** like any other theme pack.

## Status bar picker

This extension adds two items to the **status bar** (bottom of the window):

| Item | Action |
|------|--------|
| `$(symbol-color) OpenAI` | Opens a grouped quick-pick: **Big Tech** and **AI & Startups** |
| `$(sparkle) Aurora On/Off` | Toggles the animated aurora for the active brand theme |

VS Code does not support a native dropdown in the title bar; the status-bar quick-pick is the standard pattern (similar to the Git branch picker).

## Aurora backgrounds

Aurora uses the approach from [AuroraBg](https://github.com/crlang44/AuroraBg) — a WebGL shader behind transparent editor surfaces. Each brand/mode has its own aurora script with palette colors derived from that brand.

**Requirements for aurora:**

1. Install [**Custom CSS and JS Loader**](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css)  
   - VS Code Marketplace: `be5invis.vscode-custom-css`  
   - Open VSX / Antigravity: `s-h-a-d-o-w.vscode-custom-css`
2. Enable aurora via the status bar toggle or **Brand Themes: Enable Aurora Background**
3. When prompted, run **Enable Custom CSS and JS** and reload

**Notes:**

- Aurora is a **toggle**, not a separate theme — keep `OpenAI Dark` and flip aurora on/off.
- After VS Code/Cursor updates, re-run **Enable Custom CSS and JS**.
- You may see an “installation appears corrupt” warning — expected with custom CSS; dismiss it.

## Commands

| Command | Description |
|---------|-------------|
| `Brand Themes: Pick Theme` | Quick-pick all 48 themes |
| `Brand Themes: Pick by Category` | Filter Big Tech vs Startups first |
| `Brand Themes: Toggle Aurora Background` | On/off aurora for current theme |
| `Brand Themes: Enable Aurora Background` | Turn aurora on |
| `Brand Themes: Disable Aurora Background` | Turn aurora off |

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `brandThemes.aurora.enabled` | `false` | Aurora on/off (synced with status bar) |
| `brandThemes.showStatusBarPicker` | `true` | Show status bar controls |

## Publish to Marketplace

1. Create a [publisher](https://marketplace.visualstudio.com/manage) on the VS Code Marketplace
2. Update `publisher` in `package.json` to your publisher id
3. `npx vsce login <publisher>`
4. `npm run publish`

## Publish to GitHub

```bash
git init
git add .
git commit -m "Initial release: 48 brand themes with aurora toggle"
gh repo create brand-themes --public --source=. --push
```

The repository is hosted at [github.com/EthannHongg/brand-themes](https://github.com/EthannHongg/brand-themes).

## Development

```bash
npm run generate   # Regenerate themes/ and aurora/ from scripts/brands.json
npm run package    # Build .vsix
```

Edit brand palettes in `scripts/brands.json`, then run `npm run generate`.

## License

MIT — see [LICENSE](LICENSE). Brand names and colors are inspired by public brand identities; this project is not affiliated with or endorsed by any company listed.

## Credits

- Aurora shader adapted from [crlang44/AuroraBg](https://github.com/crlang44/AuroraBg)
- Original OpenAI & Anthropic themes from the local `ai-brand-themes` extension
