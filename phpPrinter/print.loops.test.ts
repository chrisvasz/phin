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

describe('print foreach', () => {
  test('foreach (a as b) {}', () => {
    let source = 'foreach (a as b) {}'
    let expected = 'foreach ($a as $b) {}'
    expect(print(source)).toEqual(expected)
  })
})
