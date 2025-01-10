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

describe('print variables', () => {
  test('var a;', () => {
    let source = 'var a;'
    let expected = '$a;'
    expect(print(source)).toEqual(expected)
  })

  test('var a = 1;', () => {
    let source = 'var a = 1;'
    let expected = '$a = 1;'
    expect(print(source)).toEqual(expected)
  })

  test('var a: int = 1;', () => {
    let source = 'var a: int = 1;'
    let expected = '/** @var int $a */\n$a = 1;'
    expect(print(source)).toEqual(expected)
  })

  test('var a: int = 1 + 2;', () => {
    let source = 'var a: int = 1 + 2;'
    let expected = '/** @var int $a */\n$a = 1 + 2;'
    expect(print(source)).toEqual(expected)
  })
})
