// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import { PhpPrinter, PrintError } from './print'
import { Kind } from './environment'

function print(src: string) {
  let result = new PhpPrinter(() => Kind.Variable).print(parse(scan(src)))
  return result.trim()
}

describe('print: if', () => {
  test('if (true) 1', () => {
    let source = 'if (true) 1'
    let expected = 'if (true) 1;'
    expect(print(source)).toEqual(expected)
  })

  test('if (true) 1; else 2', () => {
    let source = 'if (true) 1; else 2'
    let expected = 'if (true) 1; else 2;'
    expect(print(source)).toEqual(expected)
  })

  test('if (true) {}', () => {
    let source = 'if (true) {}'
    let expected = 'if (true) {}'
    expect(print(source)).toEqual(expected)
  })

  test('if (a()) 1', () => {
    let source = 'if (a()) 1'
    let expected = 'if ($a()) 1;'
    expect(print(source)).toEqual(expected)
  })

  test('if (true) { echo "hello"; }', () => {
    let source = 'if (true) { echo "hello"; }'
    let expected = 'if (true) {\n  echo "hello";\n}'
    expect(print(source)).toEqual(expected)
  })

  test('if (true) { echo "hello"; } else { echo "world"; }', () => {
    let source = 'if (true) { echo "hello"; } else { echo "world"; }'
    let expected = `
if (true) {
  echo "hello";
} else {
  echo "world";
}
    `.trim()
    expect(print(source)).toEqual(expected)
  })
})
