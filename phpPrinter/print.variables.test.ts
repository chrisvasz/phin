// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import { PhpPrinter } from './print'

function print(src: string) {
  return new PhpPrinter().print(parse(scan(src)))
}

describe('variables', () => {
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
