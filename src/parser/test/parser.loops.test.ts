// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../../scanner'
import parse from '../parser'
import * as nodes from '../../nodes'
import * as types from '../../types'
import { b } from '../../builder'

function ast(source: string) {
  return parse(scan(source))
}

describe('parse while', () => {
  test('while (true) 2', () => {
    let source = 'while (true) 2'
    let expected = b.program(
      new nodes.While(b.true(), b.expressionStatement(b.intLiteral('2'))),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('while (1 < 2) 2', () => {
    let source = 'while (1 < 2) 2'
    let expected = b.program(
      new nodes.While(
        b.binary(b.intLiteral('1'), '<', b.intLiteral('2')),
        b.expressionStatement(b.intLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('while (null) {2;}', () => {
    let source = 'while (null) {2;}'
    let expected = b.program(
      new nodes.While(
        new nodes.NullLiteral(),
        new nodes.Block([b.expressionStatement(b.intLiteral('2'))]),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse for', () => {
  test('for (;;) 2', () => {
    let source = 'for (;;) 2'
    let expected = b.program(
      new nodes.For(null, null, null, b.expressionStatement(b.intLiteral('2'))),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('for (var i = 0; ;) 2', () => {
    let source = 'for (var i = 0; ;) 2'
    let expected = b.program(
      new nodes.For(
        new nodes.VarDeclaration('i', null, b.intLiteral('0')),
        null,
        null,
        b.expressionStatement(b.intLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('for (var i = 0; i < 10;) 2', () => {
    let source = 'for (var i = 0; i < 10;) 2'
    let expected = b.program(
      new nodes.For(
        new nodes.VarDeclaration('i', null, b.intLiteral('0')),
        b.binary(new nodes.Identifier('i'), '<', b.intLiteral('10')),
        null,
        b.expressionStatement(b.intLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('for (var i: int = 0; i < 10; ++i) {2;}', () => {
    let source = 'for (var i: int = 0; i < 10; ++i) {2;}'
    let expected = b.program(
      new nodes.For(
        new nodes.VarDeclaration('i', new types.Int(), b.intLiteral('0')),
        b.binary(new nodes.Identifier('i'), '<', b.intLiteral('10')),
        new nodes.Unary('++', new nodes.Identifier('i')),
        new nodes.Block([b.expressionStatement(b.intLiteral('2'))]),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })
})

describe('foreach', () => {
  test('foreach (list as i) 2', () => {
    let source = 'foreach (list as i) 2'
    let expected = b.program(
      new nodes.Foreach(
        null,
        new nodes.ForeachVariable('i', null),
        new nodes.Identifier('list'),
        b.expressionStatement(b.intLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('foreach (list as i) {2;}', () => {
    let source = 'foreach (list as i) {2;}'
    let expected = b.program(
      new nodes.Foreach(
        null,
        new nodes.ForeachVariable('i', null),
        new nodes.Identifier('list'),
        new nodes.Block([b.expressionStatement(b.intLiteral('2'))]),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('foreach (list as i: int) 2', () => {
    let source = 'foreach (list as i: int) 2'
    let expected = b.program(
      new nodes.Foreach(
        null,
        new nodes.ForeachVariable('i', new types.Int()),
        new nodes.Identifier('list'),
        b.expressionStatement(b.intLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('foreach (list as i => l) 2', () => {
    let source = 'foreach (list as i => l) 2'
    let expected = b.program(
      new nodes.Foreach(
        new nodes.ForeachVariable('i', null),
        new nodes.ForeachVariable('l', null),
        new nodes.Identifier('list'),
        b.expressionStatement(b.intLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('foreach (list as i: int => l: Rental) 2', () => {
    let source = 'foreach (list as i: int => l: Rental) 2'
    let expected = b.program(
      new nodes.Foreach(
        new nodes.ForeachVariable('i', new types.Int()),
        new nodes.ForeachVariable('l', new types.Identifier('Rental', [])),
        new nodes.Identifier('list'),
        b.expressionStatement(b.intLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test.todo('foreach vars added to environment')
})
