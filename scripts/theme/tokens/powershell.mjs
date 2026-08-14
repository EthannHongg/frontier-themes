/** PowerShell TextMate rules. */
export function getPowerShellTokenColors(p) {
  const { builtin, storage, property, fn } = p;
  return [
    { scope: 'source.powershell variable.other.member.powershell', settings: { foreground: property } },
    { scope: 'source.powershell support.function.powershell', settings: { foreground: fn } },
    { scope: 'source.powershell support.function.attribute.powershell', settings: { foreground: storage } },
    { scope: 'source.powershell meta.hashtable.assignment.powershell variable.other.readwrite.powershell', settings: { foreground: property } },
    { scope: 'support.function.attribute.powershell', settings: { foreground: builtin } },
  ];
}
