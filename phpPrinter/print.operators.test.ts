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

describe('print string concat', () => {
  test('a +. b', () => {
    let source = 'a +. b'
    let expected = '$a . $b;'
    expect(print(source)).toEqual(expected)
  })

  test('a +. b +. c', () => {
    let source = 'a +. b +. c'
    let expected = '$a . $b . $c;'
    expect(print(source)).toEqual(expected)
  })

  test('a +.= b', () => {
    let source = 'a +.= b'
    let expected = '$a .= $b;'
    expect(print(source)).toEqual(expected)
  })
})

describe('print assign', () => {
  test('a = b()', () => {
    let source = 'a = b()'
    let expected = '$a = $b();'
    expect(print(source)).toEqual(expected)
  })

  test('a = b = c', () => {
    let source = 'a = b = c'
    let expected = '$a = $b = $c;'
    expect(print(source)).toEqual(expected)
  })
})

describe('print grouping', () => {
  test('(1)', () => {
    let source = '(1)'
    let expected = '(1);'
    expect(print(source)).toEqual(expected)
  })
})

describe('print postfix', () => {
  test('a++', () => {
    let source = 'a++'
    let expected = '$a++;'
    expect(print(source)).toEqual(expected)
  })

  test('a--', () => {
    let source = 'a--'
    let expected = '$a--;'
    expect(print(source)).toEqual(expected)
  })
})

describe('print ::', () => {
  test('A::b', () => {
    let source = 'A::b'
    let expected = '$A::b;'
    expect(print(source)).toEqual(expected)
  })
})
