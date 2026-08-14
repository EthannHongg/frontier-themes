/** Python-specific TextMate rules. */
export function getPythonTokenColors(p) {
  const { fn, storage, keyword, purple, constant, string, type, operator, fg } = p;
  return [
    { scope: ['meta.function.python', 'entity.name.function.python'], settings: { foreground: fn } },
    { scope: ['entity.name.function.decorator.python', 'meta.function.decorator.python', 'entity.name.function.decorator'], settings: { foreground: fn, fontStyle: 'bold' } },
    { scope: ['storage.type.function.python', 'storage.type.class.python', 'storage.type.string.python', 'storage.modifier.declaration'], settings: { foreground: storage } },
    { scope: ['storage.modifier.async.python', 'storage.type.function.async.python'], settings: { foreground: storage } },
    { scope: 'keyword.control.flow.python', settings: { foreground: keyword } },
    { scope: 'support.type.python', settings: { foreground: purple } },
    { scope: 'constant.language.python', settings: { foreground: constant } },
    { scope: 'constant.other.caps', settings: { foreground: constant, fontStyle: 'bold' } },
    { scope: 'meta.function-call.generic', settings: { foreground: operator } },
    { scope: 'meta.function-call.arguments', settings: { foreground: fg } },
    { scope: 'string.quoted.docstring.multi.python', settings: { foreground: string, fontStyle: 'italic' } },
    { scope: 'support.variable.magic.python', settings: { foreground: type } },
  ];
}
