// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import * as nodes from '../nodes'
import { Expr } from '../nodes'
import { Token } from '../token'

function ast(source: string) {
  return parse(scan(source))
}

const e = (expression: Expr) => [new nodes.ExpressionStatement(expression)]
const string = (value: string) => new nodes.StringLiteral(value)
const identifier = (name: string) => new nodes.Identifier(name)
const binary = (left: Expr, operator: string, right: Expr) =>
  new nodes.Binary(left, operator, right)
const template = (...parts: Array<nodes.StringLiteral | nodes.Expr>) =>
  new nodes.TemplateStringLiteral(parts)

describe('parse double-quoted strings', () => {
  test('""', () => {
    let source = '""'
    let expected = e(string(''))
    expect(ast(source)).toEqual(expected)
  })

  test('"hello"', () => {
    let source = '"hello"'
    let expected = e(string('hello'))
    expect(ast(source)).toEqual(expected)
  })

  test('"hello" +. "world"', () => {
    let source = '"hello" +. "world"'
    let expected = e(binary(string('hello'), '+.', string('world')))
    expect(ast(source)).toEqual(expected)
  })

  test('"hello\nworld"', () => {
    let source = '"hello\nworld"'
    let expected = e(string('hello\nworld'))
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse double-quoted strings with embedded expressions', () => {
  test('"$name"', () => {
    let source = '"$name"'
    let expected = e(template(identifier('name')))
    expect(ast(source)).toEqual(expected)
  })

  test('"$123"', () => {
    let source = '"$123"'
    let expected = e(string('$123'))
    expect(ast(source)).toEqual(expected)
  })

  test('"${name}"', () => {
    let source = '"${name}"'
    let expected = e(template(identifier('name')))
    expect(ast(source)).toEqual(expected)
  })

  test('"${name()}"', () => {
    let source = '"${name()}"'
    let expected = e(template(new nodes.Call(identifier('name'), [])))
    expect(ast(source)).toEqual(expected)
  })

  test('"hello ${name}?"', () => {
    let source = '"hello ${name}?"'
    let expected = e(
      template(string('hello '), identifier('name'), string('?')),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('"1${"2${"3"}4"}5"', () => {
    let source = '"1${"2${"3"}4"}5"'
    let expected = e(
      template(
        string('1'),
        template(string('2'), string('3'), string('4')),
        string('5'),
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
