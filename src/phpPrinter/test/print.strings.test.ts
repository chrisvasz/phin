// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter } from '../print'
import compile from '../../compiler'
import { TestSymbols } from '../../symbols'
import { b, t } from '../../builder'

function print(source: string, symbols?: TestSymbols) {
  let ast = compile(source, { symbols })
  let printer = new PhpPrinter()
  return printer.print(ast).trim()
}

describe('print double-quoted strings', () => {
  test('""', () => {
    let source = '""'
    let expected = '"";'
    expect(print(source)).toEqual(expected)
  })

  test('"hello"', () => {
    let source = '"hello"'
    let expected = '"hello";'
    expect(print(source)).toEqual(expected)
  })

  test('"hello" +. "world"', () => {
    let source = '"hello" +. "world"'
    let expected = '"hello" . "world";'
    expect(print(source)).toEqual(expected)
  })

  test('"hello\\nworld"', () => {
    let source = '"hello\nworld"'
    let expected = '"hello\nworld";'
    expect(print(source)).toEqual(expected)
  })
})

describe('print template strings', () => {
  const symbols = new TestSymbols()
  symbols.add('name', b.var('name'))
  let a = b.fun('a')
  a.type = t.fun([], t.string())
  symbols.add('a', a)

  test('"$name"', () => {
    let source = '"$name"'
    let expected = '("" . $name);'
    expect(print(source, symbols)).toEqual(expected)
  })

  test('"${name}"', () => {
    let source = '"${name}"'
    let expected = '("" . $name);'
    expect(print(source, symbols)).toEqual(expected)
  })

  test('"${a()}"', () => {
    let source = '"${a()}"'
    let expected = '("" . a());'
    expect(print(source, symbols)).toEqual(expected)
  })

  test('"hello ${name}?"', () => {
    let source = '"hello ${name}?"'
    let expected = '("hello " . $name . "?");'
    expect(print(source, symbols)).toEqual(expected)
  })

  test('"1${"2${"3"}4"}5"', () => {
    let source = '"1${"2${"3"}4"}5"'
    let expected = '("1" . ("2" . "3" . "4") . "5");'
    expect(print(source)).toEqual(expected)
  })
})
