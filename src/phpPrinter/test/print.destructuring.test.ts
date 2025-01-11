// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter } from '../print'
import compile from '../../compiler'
import { TestSymbols } from '../../symbols'
import { b } from '../../builder'

const symbols = new TestSymbols()
symbols.add('a', b.var('a'))
symbols.add('b', b.var('b'))
symbols.add('c', b.var('c'))
symbols.add('d', b.var('d'))

function ast(source: string) {
  return compile(source, { symbols })
}

function print(source: string) {
  let printer = new PhpPrinter()
  return printer.print(ast(source)).trim()
}

describe('print destructuring assignment', () => {
  test('var [a] = c', () => {
    let source = 'var [a] = c'
    let expected = '[$a] = $c;'
    expect(print(source)).toEqual(expected)
  })

  test('var [a, b, c] = d', () => {
    let source = 'var [a, b, c] = d'
    let expected = '[$a, $b, $c] = $d;'
    expect(print(source)).toEqual(expected)
  })

  test('var [, , c] = d', () => {
    let source = 'var [, , c] = d'
    let expected = '[, , $c] = $d;'
    expect(print(source)).toEqual(expected)
  })

  test('var ["a" => b] = c', () => {
    let source = 'var ["a" => b] = c'
    let expected = `['a' => $b] = $c;`
    expect(print(source)).toEqual(expected)
  })
})
