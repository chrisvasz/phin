// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter } from '../print'
import { Token } from '../../token'
import compile, {
  resolveUndeclaredIdentifiersToVariables,
} from '../../compiler'

function ast(source: string) {
  return compile(source, {
    resolveUndeclaredIdentifiers: resolveUndeclaredIdentifiersToVariables,
  })
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

  test('["a",b(),c<d]', () => {
    let source = '["a",b(),c<d]'
    let expected = '["a", $b(), $c < $d];'
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

  test('[1=>2,"3"=>4+5,a()]', () => {
    let source = '[1=>2,"3"=>4+5,a()]'
    let expected = '[1 => 2, "3" => 4 + 5, $a()];'
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
