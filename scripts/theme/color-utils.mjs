export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export function rgbToHex([r, g, b]) {
  return `#${[r, g, b].map((n) => Math.round(n).toString(16).padStart(2, '0')).join('')}`;
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

/** Mix fg toward bg — lower amount = more readable (less muted). */
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

export function rgbToHsl(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }

  return { h: h * 360, s, l };
}

export function hslToHex(h, s, l) {
  const hue = ((h % 360) + 360) % 360 / 360;
  let r;
  let g;
  let b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      let tt = t;
      if (tt < 0) tt += 1;
      if (tt > 1) tt -= 1;
      if (tt < 1 / 6) return p + (q - p) * 6 * tt;
      if (tt < 1 / 2) return q;
      if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, hue + 1 / 3);
    g = hue2rgb(p, q, hue);
    b = hue2rgb(p, q, hue - 1 / 3);
  }

  return rgbToHex([r * 255, g * 255, b * 255]);
}

/**
 * Shift a Gruvbox-style syntax color toward the brand primary hue while
 * preserving saturation and lightness (readable, vivid roles).
 */
export function brandSyntaxRole(roleHex, primaryHex, brandWeight = 0.22) {
  const role = rgbToHsl(roleHex);
  const brand = rgbToHsl(primaryHex);
  const h = role.h * (1 - brandWeight) + brand.h * brandWeight;
  const s = Math.min(1, Math.max(role.s, brand.s * 0.75, 0.45));
  const l = role.l;
  return hslToHex(h, s, l);
}
