/** Base TextMate rules shared by all languages. */
export function getBaseTokenColors(p) {
  const {
    fg, mutedFg, subtleFg, comment, string, constant, keyword, storage, operator,
    regexp, escape, fn, method, type, builtin, variable, parameter, property, tag,
    attribute, invalid, deprecated, purple, info,
  } = p;

  return [
    { settings: { foreground: fg } },
    { scope: 'emphasis', settings: { fontStyle: 'italic' } },
    { scope: 'strong', settings: { fontStyle: 'bold' } },
    { scope: 'header', settings: { foreground: info } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: comment, fontStyle: 'italic' } },
    { scope: ['constant', 'support.constant', 'variable.arguments'], settings: { foreground: purple } },
    { scope: 'constant.rgb-value', settings: { foreground: fg } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character'], settings: { foreground: constant } },
    { scope: ['string', 'string.quoted'], settings: { foreground: string } },
    { scope: ['string.regexp', 'string.regexp.character-class'], settings: { foreground: regexp } },
    { scope: ['constant.character.escape', 'string.escape'], settings: { foreground: escape } },
    { scope: 'string.quasi', settings: { foreground: operator } },
    { scope: 'storage', settings: { foreground: keyword } },
    { scope: ['storage.type', 'storage.modifier'], settings: { foreground: storage } },
    { scope: ['keyword', 'keyword.control', 'keyword.other'], settings: { foreground: keyword } },
    { scope: 'keyword.operator', settings: { foreground: operator } },
    { scope: 'keyword.operator.new', settings: { foreground: storage } },
    { scope: 'keyword.other.unit', settings: { foreground: string } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: fn } },
    { scope: ['entity.name.method', 'meta.method-call'], settings: { foreground: method } },
    { scope: 'support.function.builtin', settings: { foreground: builtin } },
    { scope: ['entity.name.class', 'entity.name.type', 'support.type', 'support.class'], settings: { foreground: type } },
    { scope: ['meta.type.name', 'meta.return.type', 'variable.class'], settings: { foreground: type } },
    { scope: ['variable', 'meta.definition.variable', 'variable.name', 'variable.other'], settings: { foreground: variable } },
    { scope: ['variable.parameter', 'variable.other.property', 'support.type.property-name'], settings: { foreground: property } },
    { scope: ['variable.this', 'support.variable'], settings: { foreground: purple } },
    { scope: ['entity.name.tag', 'punctuation.tag'], settings: { foreground: tag } },
    { scope: ['entity.other.attribute-name', 'entity.name.selector'], settings: { foreground: attribute } },
    { scope: ['punctuation', 'meta.brace'], settings: { foreground: subtleFg } },
    { scope: 'meta.preprocessor', settings: { foreground: storage } },
    { scope: ['invalid', 'invalid.illegal'], settings: { foreground: invalid } },
    { scope: 'invalid.deprecated', settings: { foreground: deprecated } },
    { scope: ['*url*', '*link*', '*uri*'], settings: { fontStyle: 'underline' } },
  ];
}
