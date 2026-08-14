/** YAML TextMate rules. */
export function getYamlTokenColors(p) {
  const { property, string, operator, constant, keyword } = p;
  return [
    { scope: 'entity.name.tag.yaml', settings: { foreground: property } },
    { scope: 'support.type.property-name.yaml', settings: { foreground: property } },
    { scope: 'string.unquoted.plain.out.yaml', settings: { foreground: string } },
    { scope: 'constant.language.yaml', settings: { foreground: keyword } },
    { scope: 'constant.numeric.yaml', settings: { foreground: constant } },
    { scope: 'punctuation.separator.key-value.mapping.yaml', settings: { foreground: operator } },
  ];
}
