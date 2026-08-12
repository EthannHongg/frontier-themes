export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export function withAlpha(hex, alpha) {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${hex.replace('#', '')}${a}`;
}

export function mix(hex1, hex2, proportionOfHex2 = 0.5) {
  const a = hexToRgb(hex1);
  const b = hexToRgb(hex2);
  const w = proportionOfHex2;
  const r = Math.round(a[0] * (1 - w) + b[0] * w);
  const g = Math.round(a[1] * (1 - w) + b[1] * w);
  const bl = Math.round(a[2] * (1 - w) + b[2] * w);
  return `#${[r, g, bl].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}

export function muted(fg, bg, amount = 0.55) {
  return mix(fg, bg, amount);
}

export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function onPrimary(hex) {
  return luminance(hex) > 0.55 ? '#1A1A1A' : '#FFFFFF';
}
