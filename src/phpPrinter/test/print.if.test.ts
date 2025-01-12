// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter } from '../print'
import { trimMargin } from '../trimMargin'
import compile from '../../compiler'
import { TestSymbols } from '../../symbols'
import { b, t } from '../../builder'

function print(source: string, symbols?: TestSymbols) {
  let ast = compile(source, { symbols })
  let printer = new PhpPrinter()
  return printer.print(ast).trim()
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
    let symbols = new TestSymbols()
    symbols.add('a', b.fun('a'))
    let source = 'if (a()) 1'
    let expected = 'if (a()) 1;'
    expect(print(source, symbols)).toEqual(expected)
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
  test('true ? true : false', () => {
    let source = 'true ? true : false'
    let expected = 'true ? true : false;'
    expect(print(source)).toEqual(expected)
  })

  test.todo('true ? a() : b()', () => {
    let source = 'true ? a() : b()'
    let expected = 'true ? a() : b();'
    let symbols = new TestSymbols()
    symbols.add('a', b.fun('a', { returnType: t.null() }))
    symbols.add('b', b.fun('b', { returnType: t.null() }))
    expect(print(source, symbols)).toEqual(expected)
  })
})
