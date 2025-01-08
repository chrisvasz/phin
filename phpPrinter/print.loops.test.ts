// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter } from './print'
import compile from '../compiler'

function ast(source: string) {
  return compile(source)
}

function print(source: string) {
  let printer = new PhpPrinter()
  return printer.print(ast(source)).trim()
}

describe('print foreach', () => {
  test('var a; foreach (a as b) { b; }', () => {
    let source = 'var a; foreach (a as b) { b; }'
    let expected = '$a;\nforeach ($a as $b) {\n  $b;\n}'
    expect(print(source)).toEqual(expected)
  })
})
