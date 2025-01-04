// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../../scanner'
import parse from '../parser'
import * as nodes from '../nodes'
import { b, t } from '../parser.builder'

function ast(source: string) {
  return parse(scan(source))
}

describe('parse optional semis', () => {
  test('a(b)', () => {
    let source = 'a(b)'
    let expected = b.program(
      b.expressionStatement(b.call(b.id('a'), b.id('b'))),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('a;;;(b)', () => {
    let source = 'a;;;(b)'
    let expected = b.program(
      b.expressionStatement(b.id('a')),
      b.expressionStatement(b.grouping(b.id('b'))),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('a\\n(b)', () => {
    let source = 'a\n(b)'
    let expected = b.program(
      b.expressionStatement(b.call(b.id('a'), b.id('b'))),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('a;;;[b]', () => {
    let source = 'a;;;[b]'
    let expected = b.program(
      b.expressionStatement(b.id('a')),
      b.expressionStatement(
        new nodes.ArrayLiteral([new nodes.ArrayElement(null, b.id('b'))]),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('a\\n[b]', () => {
    let source = 'a\n[b]'
    let expected = b.program(
      b.expressionStatement(b.arrayAccess(b.id('a'), b.id('b'))),
    )
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse optional semis between declarations', () => {
  test('var a var b', () => {
    let source = 'var a var b'
    let expected = b.program(b.var('a'), b.var('b'))
    expect(ast(source)).toEqual(expected)
  })

  test('var a;;;var b', () => {
    let source = 'var a;;;var b'
    let expected = b.program(b.var('a'), b.var('b'))
    expect(ast(source)).toEqual(expected)
  })

  test('fun a(){}fun b(){}', () => {
    let source = 'fun a(){}fun b(){}'
    let expected = b.program(b.fun('a'), b.fun('b'))
    expect(ast(source)).toEqual(expected)
  })

  test('fun a(){};;;fun b(){}', () => {
    let source = 'fun a(){};;;fun b(){}'
    let expected = b.program(b.fun('a'), b.fun('b'))
    expect(ast(source)).toEqual(expected)
  })

  test('class A{}class B{}', () => {
    let source = 'class A{}class B{}'
    let expected = b.program(
      new nodes.ClassDeclaration('A', null, [], null, [], null, [], false),
      new nodes.ClassDeclaration('B', null, [], null, [], null, [], false),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A{};;;class B{}', () => {
    let source = 'class A{};;;class B{}'
    let expected = b.program(
      new nodes.ClassDeclaration('A', null, [], null, [], null, [], false),
      new nodes.ClassDeclaration('B', null, [], null, [], null, [], false),
    )
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse optional semis between block statements', () => {
  test('if (a) {1 2}', () => {
    let source = 'if (a) {1 2}'
    let expected = b.program(
      new nodes.If(
        b.id('a'),
        b.block(
          b.expressionStatement(b.numberLiteral(1)),
          b.expressionStatement(b.numberLiteral(2)),
        ),
        null,
      ),
    )
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse optional semis between block statements', () => {
  test('if (a) {1;;;2}', () => {
    let source = 'if (a) {1;;;2}'
    let expected = b.program(
      new nodes.If(
        b.id('a'),
        b.block(
          b.expressionStatement(b.numberLiteral(1)),
          b.expressionStatement(b.numberLiteral(2)),
        ),
        null,
      ),
    )
    expect(ast(source)).toEqual(expected)
  })
})
