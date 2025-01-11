// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../../scanner'
import parse from '../parser'
import { b, t } from '../../builder'

function ast(source: string) {
  return parse(scan(source))
}

describe('parse class declarations', () => {
  test('class A {}', () => {
    let source = 'class A {}'
    let expected = b.program(b.class('A'))
    expect(ast(source)).toEqual(expected)
  })

  test('class A extends B {}', () => {
    let source = 'class A extends B {}'
    let expected = b.program(
      b.class('A', {
        superclass: b.classSuperclass('B'),
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A(a) extends B(a()) {}', () => {
    let source = 'class A(a) extends B(a()) {}'
    let expected = b.program(
      b.class('A', {
        params: [b.param('a')],
        superclass: b.classSuperclass('B', b.call('a')),
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A implements B {}', () => {
    let source = 'class A implements B {}'
    let expected = b.program(
      b.class('A', {
        interfaces: ['B'],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A implements B, C, D, {}', () => {
    let source = 'class A implements B, C, D {}'
    let expected = b.program(
      b.class('A', {
        interfaces: ['B', 'C', 'D'],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A extends B implements C, D {}', () => {
    let source = 'class A extends B implements C, D {}'
    let expected = b.program(
      b.class('A', {
        superclass: b.classSuperclass('B'),
        interfaces: ['C', 'D'],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A { init { echo "hello"; } }', () => {
    let source = 'class A { init { echo "hello"; } }'
    let expected = b.program(
      b.class('A', {
        members: [
          b.classInitializer(b.block(b.echo(b.stringLiteral('hello')))),
        ],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A { init { 1; } init { 2; } }', () => {
    let source = 'class A { init { 1; } init { 2; } }'
    let expected = b.program(
      b.class('A', {
        members: [
          b.classInitializer(
            b.block(b.expressionStatement(b.numberLiteral('1'))),
          ),
          b.classInitializer(
            b.block(b.expressionStatement(b.numberLiteral('2'))),
          ),
        ],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test.todo('final class A {}', () => {})
  test.todo('readonly class A {}', () => {})
})

describe('parse class params/constructor', () => {
  test('class A(b) {}', () => {
    let source = 'class A(b) {}'
    let expected = b.program(
      b.class('A', {
        params: [b.param('b')],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A(var b) {}', () => {
    let source = 'class A(var b) {}'
    let expected = b.program(
      b.class('A', {
        params: [b.classProperty('b')],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A(val b) {}', () => {
    let source = 'class A(val b) {}'
    let expected = b.program(
      b.class('A', {
        params: [b.classProperty('b', { isReadonly: true })],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A(b: number|string = 5, final public var c: bool,) {}', () => {
    let source = 'class A(b: number|string = 5, final public var c: bool,) {}'
    let expected = b.program(
      b.class('A', {
        params: [
          b.param('b', t.union(t.number(), t.string()), b.numberLiteral('5')),
          b.classProperty('c', {
            isFinal: true,
            visibility: 'public',
            type: t.bool(),
          }),
        ],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A(-var b) {}', () => {
    let source = 'class A(-var b) {}'
    let expected = b.program(
      b.class('A', {
        params: [b.classProperty('b', { visibility: 'private' })],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A(-var b: number) {}', () => {
    let source = 'class A(-var b: number) {}'
    let expected = b.program(
      b.class('A', {
        params: [
          b.classProperty('b', {
            visibility: 'private',
            type: t.number(),
          }),
        ],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A(b, +var c) {}', () => {
    let source = 'class A(b, +var c) {}'
    let expected = b.program(
      b.class('A', {
        params: [b.param('b'), b.classProperty('c', { visibility: 'public' })],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A(b, +var c: number=5) {}', () => {
    let source = 'class A(b, +var c: number=5) {}'
    let expected = b.program(
      b.class('A', {
        params: [
          b.param('b'),
          b.classProperty('c', {
            visibility: 'public',
            type: t.number(),
            initializer: b.numberLiteral('5'),
          }),
        ],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A private() {}', () => {
    let source = 'class A private() {}'
    let expected = b.program(
      b.class('A', {
        constructorVisibility: 'private',
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A -() {}', () => {
    let source = 'class A -() {}'
    let expected = b.program(
      b.class('A', {
        constructorVisibility: 'private',
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A private(a) {}', () => {
    let source = 'class A private(a) {}'
    let expected = b.program(
      b.class('A', {
        params: [b.param('a')],
        constructorVisibility: 'private',
      }),
    )
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse class properties', () => {
  test('class A { var b; }', () => {
    let source = 'class A { var b; }'
    let expected = b.program(
      b.class('A', {
        members: [b.classProperty('b')],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A { val b; }', () => {
    let source = 'class A { val b; }'
    let expected = b.program(
      b.class('A', {
        members: [b.classProperty('b', { isReadonly: true })],
      }),
    )
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse class iterates', () => {
  test('class A iterates a {}', () => {
    let source = 'class A iterates a {}'
    let expected = b.program(
      b.class('A', {
        iterates: b.id('a'),
      }),
    )
    expect(ast(source)).toEqual(expected)
  })
})
