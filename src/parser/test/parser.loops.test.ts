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
      new nodes.While(
        new nodes.BooleanLiteral(true),
        new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('while (1 < 2) 2', () => {
    let source = 'while (1 < 2) 2'
    let expected = b.program(
      new nodes.While(
        new nodes.Binary(
          new nodes.NumberLiteral('1'),
          '<',
          new nodes.NumberLiteral('2'),
        ),
        new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('while (null) {2;}', () => {
    let source = 'while (null) {2;}'
    let expected = b.program(
      new nodes.While(
        new nodes.NullLiteral(),
        new nodes.Block([
          new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
        ]),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse for', () => {
  test('for (;;) 2', () => {
    let source = 'for (;;) 2'
    let expected = b.program(
      new nodes.For(
        null,
        null,
        null,
        new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('for (var i = 0; ;) 2', () => {
    let source = 'for (var i = 0; ;) 2'
    let expected = b.program(
      new nodes.For(
        new nodes.VarDeclaration('i', null, new nodes.NumberLiteral('0')),
        null,
        null,
        new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('for (var i = 0; i < 10;) 2', () => {
    let source = 'for (var i = 0; i < 10;) 2'
    let expected = b.program(
      new nodes.For(
        new nodes.VarDeclaration('i', null, new nodes.NumberLiteral('0')),
        new nodes.Binary(
          new nodes.Identifier('i'),
          '<',
          new nodes.NumberLiteral('10'),
        ),
        null,
        new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('for (var i: number = 0; i < 10; ++i) {2;}', () => {
    let source = 'for (var i: number = 0; i < 10; ++i) {2;}'
    let expected = b.program(
      new nodes.For(
        new nodes.VarDeclaration(
          'i',
          new types.Number(),
          new nodes.NumberLiteral('0'),
        ),
        new nodes.Binary(
          new nodes.Identifier('i'),
          '<',
          new nodes.NumberLiteral('10'),
        ),
        new nodes.Unary('++', new nodes.Identifier('i')),
        new nodes.Block([
          new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
        ]),
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
        new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
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
        new nodes.Block([
          new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
        ]),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('foreach (list as i: number) 2', () => {
    let source = 'foreach (list as i: number) 2'
    let expected = b.program(
      new nodes.Foreach(
        null,
        new nodes.ForeachVariable('i', new types.Number()),
        new nodes.Identifier('list'),
        new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
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
        new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('foreach (list as i: number => l: Rental) 2', () => {
    let source = 'foreach (list as i: number => l: Rental) 2'
    let expected = b.program(
      new nodes.Foreach(
        new nodes.ForeachVariable('i', new types.Number()),
        new nodes.ForeachVariable('l', new types.Identifier('Rental', [])),
        new nodes.Identifier('list'),
        new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test.todo('foreach vars added to environment')
})
