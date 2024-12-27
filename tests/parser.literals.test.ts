// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import * as nodes from '../nodes'

function ast(source: string) {
  return parse(scan(source))
}

describe('literals', () => {
  test('null', () => {
    let source = 'null'
    let expected = [new nodes.ExpressionStatement(new nodes.NullLiteral())]
    expect(ast(source)).toEqual(expected)
  })

  test('true', () => {
    let source = 'true'
    let expected = [
      new nodes.ExpressionStatement(new nodes.BooleanLiteral(true)),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('false', () => {
    let source = 'false'
    let expected = [
      new nodes.ExpressionStatement(new nodes.BooleanLiteral(false)),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('123', () => {
    let source = '123'
    let expected = [
      new nodes.ExpressionStatement(new nodes.NumberLiteral('123')),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('123.45', () => {
    let source = '123.45'
    let expected = [
      new nodes.ExpressionStatement(new nodes.NumberLiteral('123.45')),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('"hello"', () => {
    let source = '"hello"'
    let expected = [
      new nodes.ExpressionStatement(new nodes.StringLiteral('hello')),
    ]
    expect(ast(source)).toEqual(expected)
  })
})
