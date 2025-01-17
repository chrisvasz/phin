// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter } from '../print'
import { trimMargin } from '../trimMargin'
import compile from '../../compiler'
import { TestSymbols } from '../../symbols'
import { b, t } from '../../builder'

const symbols = new TestSymbols()
let a = b.fun('a')
a.type = t.fun([], t.int())
symbols.add('a', a)
symbols.add('b', b.var('b', t.int()))

function ast(source: string) {
  return compile(source, { symbols: symbols })
}

function print(source: string) {
  let printer = new PhpPrinter()
  return printer.print(ast(source)).trim()
}

describe('print: match', () => {
  test('match (true) {}', () => {
    let source = 'match (true) {}'
    let expected = 'match (true) {};'
    expect(print(source)).toEqual(expected)
  })

  test('match (true) { 1 => 1 }', () => {
    let source = 'match (true) { 1 => 1 }'
    let expected = trimMargin(`
      match (true) {
        1 => 1,
      };
    `)
    expect(print(source)).toEqual(expected)
  })

  test('match (true) { 1, 2 => 3, a(), b < 2 => 5 }', () => {
    let source = 'match (true) { 1, 2 => 3, a(), b < 2 => 5 }'
    let expected = trimMargin(`
      match (true) {
        1, 2 => 3,
        a(), $b < 2 => 5,
      };
    `)
    expect(print(source)).toEqual(expected)
  })

  test('match (true) { 1 => 2, default => 6 }', () => {
    let source = 'match (true) { 1 => 2, default => 6 }'
    let expected = trimMargin(`
      match (true) {
        1 => 2,
        default => 6,
      };
    `)
    expect(print(source)).toEqual(expected)
  })

  test('match (true) { default => throw 1 }', () => {
    let source = 'match (true) { default => throw 1 }'
    let expected = trimMargin(`
      match (true) {
        default => throw 1,
      };
    `)
    expect(print(source)).toEqual(expected)
  })
})
