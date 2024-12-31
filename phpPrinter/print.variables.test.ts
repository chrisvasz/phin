// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import { PhpPrinter } from './print'
import { Kind } from './environment'

function print(src: string) {
  let printer = new PhpPrinter(() => Kind.Variable)
  return printer.print(parse(scan(src))).trim()
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

describe('print destructuring var declaration', () => {
  test('var [a, b] = c;', () => {
    let source = 'var [a, b] = c;'
    let expected = '[$a, $b] = $c;'
    expect(print(source)).toEqual(expected)
  })

  test.todo('destructuring assignment in a foreach loop')
})
