// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import * as nodes from '../nodes'

function ast(source: string) {
  return parse(scan(source))
}

describe('echo statements', () => {
  test('echo "hello"', () => {
    let source = 'echo "hello"'
    let expected = [new nodes.Echo(new nodes.StringLiteral('hello'))]
    expect(ast(source)).toEqual(expected)
  })
})

describe('blocks', () => {
  test(';;;', () => {
    let source = ';;;'
    let expected: [] = []
    expect(ast(source)).toEqual(expected)
  })

  test('{ 1; 2; }', () => {
    let source = '{ 1; 2; }'
    let expected = [
      new nodes.Block([
        new nodes.ExpressionStatement(new nodes.NumberLiteral('1')),
        new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
      ]),
    ]
    expect(ast(source)).toEqual(expected)
  })
})
