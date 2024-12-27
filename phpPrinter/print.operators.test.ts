// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import { PhpPrinter } from './print'
import { Kind } from './environment'

function print(src: string) {
  let result = new PhpPrinter(() => Kind.Var).print(parse(scan(src)))
  return result.trim()
}

describe('print new', () => {
  test('new a', () => {
    let source = 'new a'
    let expected = 'new $a;'
    expect(print(source)).toEqual(expected)
  })

  test('new a()', () => {
    let source = 'new a()'
    let expected = 'new $a();'
    expect(print(source)).toEqual(expected)
  })
})

describe('print .', () => {
  test('a.b', () => {
    let source = 'a.b'
    let expected = '$a->b;'
    expect(print(source)).toEqual(expected)
  })

  test('a().b', () => {
    let source = 'a().b'
    let expected = '$a()->b;'
    expect(print(source)).toEqual(expected)
  })
})
