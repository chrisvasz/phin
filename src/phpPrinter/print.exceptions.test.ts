// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter, PrintError } from './print'
import { trimMargin } from './trimMargin'
import compile, { resolveUndeclaredIdentifiersToFunctions } from '../compiler'

function ast(source: string) {
  return compile(source, {
    resolveUndeclaredIdentifiers: resolveUndeclaredIdentifiersToFunctions,
  })
}

function print(source: string) {
  let printer = new PhpPrinter()
  return printer.print(ast(source)).trim()
}

describe('print throw expressions', () => {
  test('var a = throw b', () => {
    let source = 'var a = throw b'
    let expected = '$a = throw b;'
    expect(print(source)).toEqual(expected)
  })
})

describe('print throw statements', () => {
  test('throw b', () => {
    let source = 'throw b'
    let expected = 'throw b;'
    expect(print(source)).toEqual(expected)
  })
})

describe('print try-catch statements', () => {
  test.todo('try {} catch (e) {}')
})
