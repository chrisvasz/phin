// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter } from '../print'
import compile from '../../compiler'
import { trimMargin } from '../trimMargin'
import { TestSymbols } from '../../symbols'
import { b } from '../../builder'

const symbols = new TestSymbols()
symbols.add('a', b.var('a'))
symbols.add('b', b.var('b'))
symbols.add('c', b.var('c'))
symbols.add('map', b.fun('map'))
symbols.add('filter', b.fun('filter'))
symbols.add('sum', b.fun('sum'))
symbols.add('A', b.class('A'))

function ast(source: string) {
  return compile(source, { symbols })
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

describe('print clone', () => {
  test('clone a', () => {
    let source = 'clone a'
    let expected = 'clone $a;'
    expect(print(source)).toEqual(expected)
  })

  test('clone a()', () => {
    let source = 'clone a()'
    let expected = 'clone $a();'
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
    let expected = 'A::b;'
    expect(print(source)).toEqual(expected)
  })
})

describe('print |', () => {
  test('a | b', () => {
    let source = 'a | b'
    let expected = '$b($a);'
    expect(print(source)).toEqual(expected)
  })

  test('a | b | c', () => {
    let source = 'a | b | c'
    let expected = '$c($b($a));'
    expect(print(source)).toEqual(expected)
  })

  test('a | map(fun(r) => r + 1) | filter() | sum', () => {
    let source = 'a | map(fun(r) => r + 1) | filter() | sum'
    let expected = trimMargin(`
      sum(filter()(map(function ($r) {
        return $r + 1;
      })($a)));
    `)
    expect(print(source)).toEqual(expected)
  })
})
