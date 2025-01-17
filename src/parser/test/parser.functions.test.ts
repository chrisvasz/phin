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
      b.expressionStatement(b.call('thing', b.intLiteral('1'))),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('thing(1, 2)', () => {
    let source = 'thing(1, 2)'
    let expected = b.program(
      b.expressionStatement(
        b.call('thing', b.intLiteral('1'), b.intLiteral('2')),
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
          b.binary(b.intLiteral('1'), '+', b.intLiteral('2')),
          b.binary(b.intLiteral('3'), '-', b.intLiteral('4')),
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
      b.expressionStatement(b.call('thing', b.intLiteral('1'))),
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

  test('fun foo(a: array<int>, b: string,) {}', () => {
    let source = 'fun foo(a: array<int>, b: string,) {}'
    let expected = b.program(
      b.fun('foo', {
        params: [
          b.param('a', t.id('array', t.int())),
          b.param('b', t.string()),
        ],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo(): array<int> {}', () => {
    let source = 'fun foo(): array<int> {}'
    let expected = b.program(
      b.fun('foo', { returnType: t.id('array', t.int()) }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo() {2;3;}', () => {
    let source = 'fun foo() {2;3;}'
    let expected = b.program(
      b.fun('foo', {
        body: b.block(
          b.expressionStatement(b.intLiteral('2')),
          b.expressionStatement(b.intLiteral('3')),
        ),
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo(a: int = 1) {}', () => {
    let source = 'fun foo(a: int = 1) {}'
    let expected = b.program(
      b.fun('foo', {
        params: [b.param('a', t.int(), b.intLiteral('1'))],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo() { return 1; }', () => {
    let source = 'fun foo() { return 1; }'
    let expected = b.program(
      b.fun('foo', {
        body: b.block(b.return(b.intLiteral('1'))),
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo() { 3; return 1; }', () => {
    let source = 'fun foo() { 3; return 1; }'
    let expected = b.program(
      b.fun('foo', {
        body: b.block(
          b.expressionStatement(b.intLiteral('3')),
          b.return(b.intLiteral('1')),
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
  test('a = fun() {};', () => {
    let source = 'a = fun() {};'
    let expected = b.program(
      b.expressionStatement(b.assign(b.id('a'), '=', b.fun(null))),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var a = fun() {};', () => {
    let source = 'var a = fun() {};'
    let expected = b.program(b.var('a', null, b.fun(null)))
    expect(ast(source)).toEqual(expected)
  })

  test('var a = fun(): int => 1;', () => {
    let source = 'var a = fun(): int => 1;'
    let expected = b.program(
      b.var(
        'a',
        null,
        b.fun(null, {
          returnType: t.int(),
          body: b.intLiteral('1'),
        }),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var a = fun(b: int|string = 4, c = 6,) { return 5; }', () => {
    let source = 'var a = fun(b: int|string = 4, c = 6) { return 5; }'
    let expected = b.program(
      b.var(
        'a',
        null,
        b.fun(null, {
          params: [
            b.param('b', t.union(t.int(), t.string()), b.intLiteral('4')),
            b.param('c', null, b.intLiteral('6')),
          ],
          body: b.block(b.return(b.intLiteral('5'))),
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
