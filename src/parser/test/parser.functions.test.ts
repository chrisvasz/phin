// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../../scanner'
import parse from '../parser'
import { b, t } from '../../builder'

function ast(source: string) {
  return parse(scan(source))
}

describe('call expressions', () => {
  const ast = (source: string) => parse(scan(source), {})

  test('thing()', () => {
    let source = 'thing()'
    let expected = b.program(b.expressionStatement(b.call('thing')))
    expect(ast(source)).toEqual(expected)
  })

  test('thing(1)', () => {
    let source = 'thing(1)'
    let expected = b.program(
      b.expressionStatement(b.call('thing', b.numberLiteral('1'))),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('thing(1, 2)', () => {
    let source = 'thing(1, 2)'
    let expected = b.program(
      b.expressionStatement(
        b.call('thing', b.numberLiteral('1'), b.numberLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('thing(1 + 2, 3 - 4)', () => {
    let source = 'thing(1 + 2, 3 - 4)'
    let expected = b.program(
      b.expressionStatement(
        b.call(
          'thing',
          b.binary(b.numberLiteral('1'), '+', b.numberLiteral('2')),
          b.binary(b.numberLiteral('3'), '-', b.numberLiteral('4')),
        ),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('thing(thing2())', () => {
    let source = 'thing(thing2())'
    let expected = b.program(
      b.expressionStatement(b.call('thing', b.call('thing2'))),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('thing(1,)', () => {
    let source = 'thing(1,)'
    let expected = b.program(
      b.expressionStatement(b.call('thing', b.numberLiteral('1'))),
    )
    expect(ast(source)).toEqual(expected)
  })
})

describe('function declarations', () => {
  test('fun foo() {}', () => {
    let source = 'fun foo() {}'
    let expected = b.program(b.fun('foo'))
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo(a) {}', () => {
    let source = 'fun foo(a) {}'
    let expected = b.program(b.fun('foo', { params: [b.param('a')] }))
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo(a: array<number>, b: string,) {}', () => {
    let source = 'fun foo(a: array<number>, b: string,) {}'
    let expected = b.program(
      b.fun('foo', {
        params: [
          b.param('a', t.id('array', t.number())),
          b.param('b', t.string()),
        ],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo(): array<number> {}', () => {
    let source = 'fun foo(): array<number> {}'
    let expected = b.program(
      b.fun('foo', { returnType: t.id('array', t.number()) }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo() {2;3;}', () => {
    let source = 'fun foo() {2;3;}'
    let expected = b.program(
      b.fun('foo', {
        body: b.block(
          b.expressionStatement(b.numberLiteral('2')),
          b.expressionStatement(b.numberLiteral('3')),
        ),
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo(a: number = 1) {}', () => {
    let source = 'fun foo(a: number = 1) {}'
    let expected = b.program(
      b.fun('foo', {
        params: [b.param('a', t.number(), b.numberLiteral('1'))],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo() { return 1; }', () => {
    let source = 'fun foo() { return 1; }'
    let expected = b.program(
      b.fun('foo', {
        body: b.block(b.return(b.numberLiteral('1'))),
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo() { 3; return 1; }', () => {
    let source = 'fun foo() { 3; return 1; }'
    let expected = b.program(
      b.fun('foo', {
        body: b.block(
          b.expressionStatement(b.numberLiteral('3')),
          b.return(b.numberLiteral('1')),
        ),
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  // this one has weird scoping rules in PHP
  test.todo('fun foo() { fun bar() {} }', () => {
    let source = 'fun foo() { fun bar() {} }'
    let expected = b.program(
      b.fun('foo', {
        body: b.block(b.fun('bar')),
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo() => thing();', () => {
    let source = 'fun foo() => thing();'
    let expected = b.program(
      b.fun('foo', {
        body: b.call('thing'),
      }),
    )
    expect(ast(source)).toEqual(expected)
  })
})

describe('function expressions', () => {
  test('var a = fun() {};', () => {
    let source = 'var a = fun() {};'
    let expected = b.program(b.var('a', null, b.fun(null)))
    expect(ast(source)).toEqual(expected)
  })

  test('var a = fun(): number => 1;', () => {
    let source = 'var a = fun(): number => 1;'
    let expected = b.program(
      b.var(
        'a',
        null,
        b.fun(null, {
          returnType: t.number(),
          body: b.numberLiteral('1'),
        }),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var a = fun(b: number|string = 4, c = 6,) { return 5; }', () => {
    let source = 'var a = fun(b: number|string = 4, c = 6) { return 5; }'
    let expected = b.program(
      b.var(
        'a',
        null,
        b.fun(null, {
          params: [
            b.param('b', t.union(t.number(), t.string()), b.numberLiteral('4')),
            b.param('c', null, b.numberLiteral('6')),
          ],
          body: b.block(b.return(b.numberLiteral('5'))),
        }),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var a = fun(b) => fun(c) => b + c;', () => {
    let source = 'var a = fun(b) => fun(c) => b + c;'
    let expected = b.program(
      b.var(
        'a',
        null,
        b.fun(null, {
          params: [b.param('b')],
          body: b.fun(null, {
            params: [b.param('c')],
            body: b.binary(b.id('b'), '+', b.id('c')),
          }),
        }),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })
})
