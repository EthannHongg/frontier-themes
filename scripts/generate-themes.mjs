#!/usr/bin/env node
/**
 * Generates VS Code color theme JSON files from brand palette definitions.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildTheme } from './theme/build-theme.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const brands = JSON.parse(fs.readFileSync(path.join(__dirname, 'brands.json'), 'utf8'));

const allBrands = [...brands.bigtech, ...brands.startups];
const themesDir = path.join(ROOT, 'themes');
const catalog = [];

fs.mkdirSync(themesDir, { recursive: true });
fs.mkdirSync(path.join(ROOT, 'src'), { recursive: true });

for (const brand of allBrands) {
  for (const mode of ['dark', 'light']) {
    const theme = buildTheme(brand, mode);
    const filename = `${brand.id}-${mode}.json`;
    fs.writeFileSync(path.join(themesDir, filename), JSON.stringify(theme, null, 2) + '\n');
    catalog.push({
      id: brand.id,
      name: brand.name,
      mode,
      label: theme.name,
      filename,
      category: brands.bigtech.some((b) => b.id === brand.id) ? 'bigtech' : 'startups',
      primary: brand.primary,
      secondary: brand.secondary,
      accent: brand.accent,
      background: brand[mode].editor,
    });
  }
}

fs.writeFileSync(path.join(ROOT, 'src', 'themeCatalog.json'), JSON.stringify(catalog, null, 2) + '\n');

const packagePath = path.join(ROOT, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
pkg.contributes.themes = catalog.map((entry) => ({
  label: entry.label,
  uiTheme: entry.mode === 'dark' ? 'vs-dark' : 'vs',
  path: `./themes/${entry.filename}`,
}));
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, '\t') + '\n');

console.log(`Generated ${catalog.length} themes and updated package.json`);
