/** JSON TextMate rules. */
export function getJsonTokenColors(p) {
  const { property, string, constant, operator } = p;
  return [
    { scope: 'support.type.property-name.json', settings: { foreground: property } },
    { scope: 'string.quoted.double.json', settings: { foreground: string } },
    { scope: 'constant.numeric.json', settings: { foreground: constant } },
    { scope: 'constant.language.json', settings: { foreground: operator } },
  ];
}
