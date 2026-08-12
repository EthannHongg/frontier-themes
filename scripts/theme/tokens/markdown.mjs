/** Markdown TextMate rules with heading hierarchy. */
export function getMarkdownTokenColors(p) {
  const { primary, info, type, fn, string, attribute, comment, error, success, warning } = p;
  return [
    { scope: 'markup.heading.1.markdown', settings: { foreground: primary, fontStyle: 'bold' } },
    { scope: 'markup.heading.2.markdown', settings: { foreground: info, fontStyle: 'bold' } },
    { scope: 'markup.heading.3.markdown', settings: { foreground: type, fontStyle: 'bold' } },
    { scope: 'markup.heading.4.markdown', settings: { foreground: fn, fontStyle: 'bold' } },
    { scope: 'markup.heading.5.markdown', settings: { foreground: string, fontStyle: 'bold' } },
    { scope: 'markup.heading.6.markdown', settings: { foreground: attribute, fontStyle: 'bold' } },
    { scope: ['markup.bold', 'markup.bold.markdown'], settings: { fontStyle: 'bold' } },
    { scope: ['markup.italic', 'markup.italic.markdown'], settings: { fontStyle: 'italic' } },
    { scope: ['markup.inline.raw', 'markup.fenced_code'], settings: { foreground: string } },
    { scope: 'markup.quote.markdown', settings: { foreground: comment, fontStyle: 'italic' } },
    { scope: 'markup.inserted', settings: { foreground: success } },
    { scope: 'markup.deleted', settings: { foreground: error } },
    { scope: 'markup.changed', settings: { foreground: warning } },
    { scope: 'markup.list', settings: { foreground: attribute } },
  ];
}
