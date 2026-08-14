/** Java TextMate rules. */
export function getJavaTokenColors(p) {
  const { fg, mutedFg, operator, type, fn, storage, comment } = p;
  return [
    { scope: ['storage.modifier.import.java', 'storage.modifier.package.java'], settings: { foreground: mutedFg } },
    { scope: ['keyword.other.import.java', 'keyword.other.package.java'], settings: { foreground: operator } },
    { scope: 'storage.type.java', settings: { foreground: storage } },
    { scope: 'storage.type.annotation', settings: { foreground: type, fontStyle: 'bold' } },
    { scope: 'keyword.other.documentation.javadoc', settings: { foreground: operator } },
    { scope: 'comment.block.javadoc variable.parameter.java', settings: { foreground: fn, fontStyle: 'bold' } },
    { scope: ['source.java variable.other.object', 'source.java variable.other.definition.java'], settings: { foreground: fg } },
    { scope: 'entity.name.type.class.java', settings: { foreground: type } },
    { scope: 'entity.name.function.java', settings: { foreground: fn } },
    { scope: 'comment.block.javadoc', settings: { foreground: comment, fontStyle: 'italic' } },
  ];
}
