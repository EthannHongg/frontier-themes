/** CSS / SCSS / Less TextMate rules. */
export function getCssTokenColors(p) {
  const { tag, attribute, constant, string, operator, storage } = p;
  return [
    { scope: ['entity.name.tag.css', 'entity.name.tag.scss'], settings: { foreground: tag } },
    { scope: ['entity.other.attribute-name.class.css', 'entity.other.attribute-name.id.css'], settings: { foreground: attribute } },
    { scope: 'support.constant.property-value.css', settings: { foreground: constant } },
    { scope: 'support.constant.color.css', settings: { foreground: string } },
    { scope: 'keyword.other.unit.css', settings: { foreground: operator } },
    { scope: 'support.type.property-name.css', settings: { foreground: storage } },
  ];
}
