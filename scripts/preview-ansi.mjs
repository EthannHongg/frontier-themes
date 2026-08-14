#!/usr/bin/env node
/** Print 16 ANSI colors — run inside the VS Code/Cursor integrated terminal. */

const esc = (n, text) => `\x1b[${n}m${text}\x1b[0m`;

console.log('\nFrontier Themes — integrated terminal ANSI palette');
console.log('Theme colors apply only inside the editor terminal.\n');

console.log('Standard:');
console.log(
  `  ${esc(30, '██ black')}   ${esc(31, '██ red')}     ${esc(32, '██ green')}   ${esc(33, '██ yellow')}`
);
console.log(
  `  ${esc(34, '██ blue')}    ${esc(35, '██ magenta')} ${esc(36, '██ cyan')}    ${esc(37, '██ white')}`
);

console.log('\nBright:');
console.log(
  `  ${esc(90, '██ bright black')}  ${esc(91, '██ bright red')}    ${esc(92, '██ bright green')}  ${esc(93, '██ bright yellow')}`
);
console.log(
  `  ${esc(94, '██ bright blue')}   ${esc(95, '██ bright magenta')} ${esc(96, '██ bright cyan')}    ${esc(97, '██ bright white')}`
);

console.log('\nSample output:');
console.log(`  ${esc(32, '✓')} generate complete`);
console.log(`  ${esc(33, '!')} warning: deprecated API`);
console.log(`  ${esc(31, '✗')} error: module not found`);
console.log(`  ${esc(36, 'info:')} OpenAI Dark active\n`);
