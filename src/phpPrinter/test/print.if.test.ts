// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter } from '../print'
import { trimMargin } from '../trimMargin'
import compile, {
  resolveUndeclaredIdentifiersToVariables,
} from '../../compiler'

function ast(source: string) {
  return compile(source, {
    resolveUndeclaredIdentifiers: resolveUndeclaredIdentifiersToVariables,
  })
}

function print(source: string) {
  let printer = new PhpPrinter()
  return printer.print(ast(source)).trim()
}

describe('print: if', () => {
  test('if (true) 1', () => {
    let source = 'if (true) 1'
    let expected = 'if (true) 1;'
    expect(print(source)).toEqual(expected)
  })

  test.todo('if (true) 1 else 2', () => {
    let source = 'if (true) 1 else 2'
    let expected = 'if (true) 1 else 2;'
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
    let expected = trimMargin(`
      if (true) {
        echo "hello";
      } else {
        echo "world";
      }
    `)
    expect(print(source)).toEqual(expected)
  })
})

describe('print: ternary', () => {
  test('true ? 1 : 2', () => {
    let source = 'true ? 1 : 2'
    let expected = 'true ? 1 : 2;'
    expect(print(source)).toEqual(expected)
  })

  test('true ? a() : b()', () => {
    let source = 'true ? a() : b()'
    let expected = 'true ? $a() : $b();'
    expect(print(source)).toEqual(expected)
  })
})