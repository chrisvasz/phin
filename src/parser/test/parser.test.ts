// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../../scanner'
import parse from '../parser'
import { b } from '../../builder'

function ast(source: string) {
  return parse(scan(source))
}

describe('echo statements', () => {
  test('echo "hello"', () => {
    let source = 'echo "hello"'
    let expected = b.program(b.echo(b.stringLiteral('hello')))
    expect(ast(source)).toEqual(expected)
  })
})

describe('blocks', () => {
  test(';;;', () => {
    let source = ';;;'
    let expected = b.program()
    expect(ast(source)).toEqual(expected)
  })

  test('{ 1; 2; }', () => {
    let source = '{ 1; 2; }'
    let expected = b.program(
      b.block(
        b.expressionStatement(b.numberLiteral('1')),
        b.expressionStatement(b.numberLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })
})
