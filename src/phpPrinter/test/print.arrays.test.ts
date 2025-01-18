// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter } from '../print'
import { Token } from '../../token'
import compile from '../../compiler'
import { TestSymbols } from '../../symbols'
import { b } from '../../builder'

const symbols = new TestSymbols()
symbols.add('a', b.var('a'))
symbols.add('b', b.var('b'))
symbols.add('c', b.var('c'))
symbols.add('d', b.var('d'))

function ast(source: string) {
  return compile(source, { symbols, typecheck: false })
}

function print(source: string) {
  let printer = new PhpPrinter()
  return printer.print(ast(source)).trim()
}

describe('print array literals', () => {
  test('[]', () => {
    let source = '[]'
    let expected = '[];'
    expect(print(source)).toEqual(expected)
  })

  test('[1, 2, 3]', () => {
    let source = '[1, 2, 3]'
    let expected = '[1, 2, 3];'
    expect(print(source)).toEqual(expected)
  })

  test('[1,2,3,]', () => {
    let source = '[1,2,3,]'
    let expected = '[1, 2, 3];'
    expect(print(source)).toEqual(expected)
  })

  test('["a",c<d]', () => {
    let source = '["a"c<d]'
    let expected = '["a", $c < $d];'
    expect(print(source)).toEqual(expected)
  })

  test('[[1,2],[3,4]]', () => {
    let source = '[[1,2],[3,4]]'
    let expected = '[[1, 2], [3, 4]];'
    expect(print(source)).toEqual(expected)
  })

  test('[1=>2]', () => {
    let source = '[1=>2]'
    let expected = '[1 => 2];'
    expect(print(source)).toEqual(expected)
  })

  test('[1=>2,"3"=>4+5]', () => {
    let source = '[1=>2,"3"=>4+5]'
    let expected = '[1 => 2, "3" => 4 + 5];'
    expect(print(source)).toEqual(expected)
  })
})

describe('print array access', () => {
  test('a[1]', () => {
    let source = 'a[1]'
    let expected = '$a[1];'
    expect(print(source)).toEqual(expected)
  })

  test('a[1][2]', () => {
    let source = 'a[1][2]'
    let expected = '$a[1][2];'
    expect(print(source)).toEqual(expected)
  })

  test('a.b[1]', () => {
    let source = 'a.b[1]'
    let expected = '$a->b[1];'
    expect(print(source)).toEqual(expected)
  })
})

function printTokens(tokens: Token[]) {
  for (let token of tokens) {
    console.log(token.toString())
  }
}
