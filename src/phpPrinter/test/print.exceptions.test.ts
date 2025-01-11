// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter } from '../print'
import compile from '../../compiler'
import { TestSymbols } from '../../symbols'
import { b } from '../../builder'

const symbols = new TestSymbols()
symbols.add('a', b.var('a'))
symbols.add('b', b.var('b'))

function ast(source: string) {
  return compile(source, { symbols })
}

function print(source: string) {
  let printer = new PhpPrinter()
  return printer.print(ast(source)).trim()
}

describe('print throw expressions', () => {
  test('var a = throw b', () => {
    let source = 'var a = throw b'
    let expected = '$a = throw $b;'
    expect(print(source)).toEqual(expected)
  })
})

describe('print throw statements', () => {
  test('throw b', () => {
    let source = 'throw b'
    let expected = 'throw $b;'
    expect(print(source)).toEqual(expected)
  })
})

describe('print try-catch statements', () => {
  test.todo('try {} catch (e) {}')
})
