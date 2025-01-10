// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../../scanner'
import parse from '../parser'
import * as nodes from '../../nodes'
import { Expr } from '../../nodes'
import { Token } from '../../token'
import { b } from '../parser.builder'

function ast(source: string) {
  return parse(scan(source))
}

const e = (expression: Expr) =>
  b.program(new nodes.ExpressionStatement(expression))
const template = (...parts: Array<nodes.StringLiteral | nodes.Expr>) =>
  new nodes.TemplateStringLiteral(parts)

describe('parse double-quoted strings', () => {
  test('""', () => {
    let source = '""'
    let expected = e(b.stringLiteral(''))
    expect(ast(source)).toEqual(expected)
  })

  test('"hello"', () => {
    let source = '"hello"'
    let expected = e(b.stringLiteral('hello'))
    expect(ast(source)).toEqual(expected)
  })

  test('"hello" +. "world"', () => {
    let source = '"hello" +. "world"'
    let expected = e(
      b.binary(b.stringLiteral('hello'), '+.', b.stringLiteral('world')),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('"hello\nworld"', () => {
    let source = '"hello\nworld"'
    let expected = e(b.stringLiteral('hello\nworld'))
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse double-quoted strings with embedded expressions', () => {
  test('"$name"', () => {
    let source = '"$name"'
    let expected = e(template(b.id('name')))
    expect(ast(source)).toEqual(expected)
  })

  test('"$123"', () => {
    let source = '"$123"'
    let expected = e(b.stringLiteral('$123'))
    expect(ast(source)).toEqual(expected)
  })

  test('"${name}"', () => {
    let source = '"${name}"'
    let expected = e(template(b.id('name')))
    expect(ast(source)).toEqual(expected)
  })

  test('"${name()}"', () => {
    let source = '"${name()}"'
    let expected = e(template(new nodes.Call(b.id('name'), [])))
    expect(ast(source)).toEqual(expected)
  })

  test('"hello ${name}?"', () => {
    let source = '"hello ${name}?"'
    let expected = e(
      template(b.stringLiteral('hello '), b.id('name'), b.stringLiteral('?')),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('"1${"2${"3"}4"}5"', () => {
    let source = '"1${"2${"3"}4"}5"'
    let expected = e(
      template(
        b.stringLiteral('1'),
        template(
          b.stringLiteral('2'),
          b.stringLiteral('3'),
          b.stringLiteral('4'),
        ),
        b.stringLiteral('5'),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })
})

function printTokens(tokens: Token[]) {
  for (let token of tokens) {
    console.log(token.toString())
  }
}
