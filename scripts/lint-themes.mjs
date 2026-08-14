#!/usr/bin/env node
/**
 * Validate generated theme JSON files for structure and minimum coverage.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const themesDir = path.join(ROOT, 'themes');

const HEX = /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/;
const MIN_COLORS = 360;
const MIN_TOKEN_RULES = 110;
const MIN_SEMANTIC = 37;

const REQUIRED_COLOR_KEYS = [
  'editor.background',
  'editor.foreground',
  'editorError.foreground',
  'editorWarning.foreground',
  'terminal.ansiRed',
  'terminal.ansiGreen',
  'editorBracketHighlight.foreground1',
  'errorLens.errorForeground',
  'gitlens.graphLane1Color',
  'notebook.cellEditorBackground',
];

/** @type {string[]} */
const errors = [];

const files = fs.readdirSync(themesDir).filter((f) => f.endsWith('.json')).sort();
if (files.length !== 48) {
  errors.push(`Expected 48 theme files, found ${files.length}`);
}

for (const file of files) {
  const label = file;
  /** @type {Record<string, unknown>} */
  let theme;
  try {
    theme = JSON.parse(fs.readFileSync(path.join(themesDir, file), 'utf8'));
  } catch (err) {
    errors.push(`${label}: invalid JSON — ${err.message}`);
    continue;
  }

  if (theme.$schema !== 'vscode://schemas/color-theme') {
    errors.push(`${label}: missing or invalid $schema`);
  }
  if (!theme.name || !theme.type) {
    errors.push(`${label}: missing name or type`);
  }
  if (!theme.semanticHighlighting) {
    errors.push(`${label}: semanticHighlighting must be true`);
  }

  const colors = theme.colors ?? {};
  const tokenColors = theme.tokenColors ?? [];
  const semantic = theme.semanticTokenColors ?? {};

  if (Object.keys(colors).length < MIN_COLORS) {
    errors.push(`${label}: only ${Object.keys(colors).length} workbench colors (min ${MIN_COLORS})`);
  }
  if (tokenColors.length < MIN_TOKEN_RULES) {
    errors.push(`${label}: only ${tokenColors.length} token rules (min ${MIN_TOKEN_RULES})`);
  }
  if (Object.keys(semantic).length < MIN_SEMANTIC) {
    errors.push(`${label}: only ${Object.keys(semantic).length} semantic tokens (min ${MIN_SEMANTIC})`);
  }

  for (const key of REQUIRED_COLOR_KEYS) {
    if (!(key in colors)) {
      errors.push(`${label}: missing required color key ${key}`);
    }
  }

  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === 'string' && value.startsWith('#') && !HEX.test(value)) {
      errors.push(`${label}: invalid hex in colors.${key}: ${value}`);
    }
  }

  for (const [i, rule] of tokenColors.entries()) {
    const fg = rule?.settings?.foreground;
    if (fg && typeof fg === 'string' && fg.startsWith('#') && !HEX.test(fg)) {
      errors.push(`${label}: invalid hex in tokenColors[${i}].settings.foreground: ${fg}`);
    }
  }
}

if (errors.length) {
  console.error(`Theme lint failed with ${errors.length} issue(s):\n`);
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log(`Theme lint passed: ${files.length} themes validated.`);
