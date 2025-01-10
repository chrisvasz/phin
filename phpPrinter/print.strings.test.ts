// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter } from './print'
import compile, { resolveUndeclaredIdentifiersToVariables } from '../compiler'

function ast(source: string) {
  return compile(source, {
    resolveUndeclaredIdentifiers: resolveUndeclaredIdentifiersToVariables,
  })
}

function print(source: string) {
  let printer = new PhpPrinter()
  return printer.print(ast(source)).trim()
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
  test('"$name"', () => {
    let source = '"$name"'
    let expected = '("" . $name);'
    expect(print(source)).toEqual(expected)
  })

  test('"${name}"', () => {
    let source = '"${name}"'
    let expected = '("" . $name);'
    expect(print(source)).toEqual(expected)
  })

  test('"${name()}"', () => {
    let source = '"${name()}"'
    let expected = '("" . $name());'
    expect(print(source)).toEqual(expected)
  })

  test('"hello ${name}?"', () => {
    let source = '"hello ${name}?"'
    let expected = '("hello " . $name . "?");'
    expect(print(source)).toEqual(expected)
  })

  test('"1${"2${"3"}4"}5"', () => {
    let source = '"1${"2${"3"}4"}5"'
    let expected = '("1" . ("2" . "3" . "4") . "5");'
    expect(print(source)).toEqual(expected)
  })
})
