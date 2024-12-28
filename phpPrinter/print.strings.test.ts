// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import * as nodes from '../nodes'
import { Expr } from '../nodes'
import { PhpPrinter } from './print'
import { Kind } from './environment'

function print(source: string) {
  let printer = new PhpPrinter(() => Kind.Variable)
  return printer.print(parse(scan(source))).trim()
}

const e = (expression: Expr) => [new nodes.ExpressionStatement(expression)]
const string = (value: string) => new nodes.StringLiteral(value)
const identifier = (name: string) => new nodes.Identifier(name)
const binary = (left: Expr, operator: string, right: Expr) =>
  new nodes.Binary(left, operator, right)
const template = (...parts: Array<nodes.StringLiteral | nodes.Expr>) =>
  new nodes.TemplateStringLiteral(parts)

describe('print double-quoted strings', () => {
  test('""', () => {
    let source = '""'
    let expected = '"";'
    expect(print(source)).toEqual(expected)
  })

  test('"hello"', () => {
    let source = '"hello"'
    let expected = '"hello";'
    expect(print(source)).toEqual(expected)
  })

  test('"hello" +. "world"', () => {
    let source = '"hello" +. "world"'
    let expected = '"hello" . "world";'
    expect(print(source)).toEqual(expected)
  })

  test('"hello\nworld"', () => {
    let source = '"hello\nworld"'
    let expected = '"hello\nworld";'
    expect(print(source)).toEqual(expected)
  })
})

describe('parse template strings', () => {
  test('``', () => {
    let source = '``'
    let expected = '"";'
    expect(print(source)).toEqual(expected)
  })

  test('`hello`', () => {
    let source = '`hello`'
    let expected = '"hello";'
    expect(print(source)).toEqual(expected)
  })

  test('`{name}`', () => {
    let source = '`{name}`'
    let expected = '("" . $name);'
    expect(print(source)).toEqual(expected)
  })

  test('`{name()}`', () => {
    let source = '`{name()}`'
    let expected = '("" . $name());'
    expect(print(source)).toEqual(expected)
  })

  test('`hello {name}?`', () => {
    let source = '`hello {name}?`'
    let expected = '("hello " . $name . "?");'
    expect(print(source)).toEqual(expected)
  })

  test('`1{`2{`3`}4`}5`', () => {
    let source = '`1{`2{`3`}4`}5`'
    let expected = '("1" . ("2" . "3" . "4") . "5");'
    expect(print(source)).toEqual(expected)
  })
})
