/** HTML / XML TextMate rules. */
export function getHtmlTokenColors(p) {
  const { tag, attribute, string, operator } = p;
  return [
    { scope: ['entity.name.tag.html', 'entity.name.tag.xml'], settings: { foreground: tag } },
    { scope: ['entity.other.attribute-name.html', 'entity.other.attribute-name.xml'], settings: { foreground: attribute } },
    { scope: 'string.quoted.double.html', settings: { foreground: string } },
    { scope: 'punctuation.definition.tag.html', settings: { foreground: operator } },
  ];
}
