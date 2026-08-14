/** C / C++ / C# TextMate rules. */
export function getCTokenColors(p) {
  const { operator, builtin, fn, fg, purple, type } = p;
  return [
    { scope: 'keyword.control.directive', settings: { foreground: operator } },
    { scope: 'support.function.C99', settings: { foreground: builtin } },
    { scope: ['meta.function.cs', 'entity.name.function.cs', 'entity.name.type.namespace.cs'], settings: { foreground: fn } },
    { scope: ['keyword.other.using.cs', 'entity.name.variable.field.cs', 'entity.name.variable.local.cs', 'variable.other.readwrite.cs'], settings: { foreground: operator } },
    { scope: ['keyword.other.this.cs', 'keyword.other.base.cs'], settings: { foreground: purple } },
    { scope: ['storage.type.c', 'storage.type.cpp'], settings: { foreground: type } },
    { scope: 'entity.name.function.preprocessor.c', settings: { foreground: builtin } },
  ];
}
