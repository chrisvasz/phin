// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import * as nodes from '../nodes'

function ast(source: string) {
  return parse(scan(source))
}

describe('if statements', () => {
  test('if (true) 2', () => {
    let source = 'if (true) 2'
    let expected = [
      new nodes.If(
        new nodes.BooleanLiteral(true),
        new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
        null,
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('if (true) {2;"5";}', () => {
    let source = 'if (true) {2;"5";}'
    let expected = [
      new nodes.If(
        new nodes.BooleanLiteral(true),
        new nodes.Block([
          new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
          new nodes.ExpressionStatement(new nodes.StringLiteral('5')),
        ]),
        null,
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('if (true) 2 else 3', () => {
    let source = 'if (true) 2 else 3'
    let expected = [
      new nodes.If(
        new nodes.BooleanLiteral(true),
        new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
        new nodes.ExpressionStatement(new nodes.NumberLiteral('3')),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('if (true) 2 else {5;}', () => {
    let source = 'if (true) 2 else {5;}'
    let expected = [
      new nodes.If(
        new nodes.BooleanLiteral(true),
        new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
        new nodes.Block([
          new nodes.ExpressionStatement(new nodes.NumberLiteral('5')),
        ]),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('if (true) 2 else if (false) 5;', () => {
    let source = 'if (true) 2 else if (false) 5;'
    let expected = [
      new nodes.If(
        new nodes.BooleanLiteral(true),
        new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
        new nodes.If(
          new nodes.BooleanLiteral(false),
          new nodes.ExpressionStatement(new nodes.NumberLiteral('5')),
          null,
        ),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('if (a()) 1;', () => {
    let source = 'if (a()) 1;'
    let expected = [
      new nodes.If(
        new nodes.Call(new nodes.Identifier('a'), []),
        new nodes.ExpressionStatement(new nodes.NumberLiteral('1')),
        null,
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })
})
