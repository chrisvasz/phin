export function trimMargin(s: string) {
  if (s[0] === '\n') s = s.slice(1)
  let leading = 0
  while (s[leading] === ' ') {
    leading++
  }
  const replace = '\n' + ' '.repeat(leading)
  return s
    .slice(leading - 1)
    .replaceAll(replace, '\n')
    .trim()
}
