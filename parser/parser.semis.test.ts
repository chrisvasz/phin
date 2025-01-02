// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import * as nodes from '../nodes'

const statements = (...expressions: nodes.Expr[]) =>
  expressions.map((expression) => new nodes.ExpressionStatement(expression))
const identifier = (name: string) => new nodes.Identifier(name)
const call = (callee: nodes.Expr, args: nodes.Expr[]) =>
  new nodes.Call(callee, args)
const grouping = (expression: nodes.Expr) => new nodes.Grouping(expression)
const block = (...statements: nodes.Stmt[]) => new nodes.Block(statements)
const number = (value: number) => new nodes.NumberLiteral(value.toString())
const a = identifier('a')
const b = identifier('b')

describe('parse optional semis', () => {
  test('a(b)', () => {
    let source = 'a(b)'
    let expected = statements(call(a, [b]))
    expect(parse(scan(source))).toEqual(expected)
  })

  test('a;;;(b)', () => {
    let source = 'a;;;(b)'
    let expected = statements(a, grouping(b))
    expect(parse(scan(source))).toEqual(expected)
  })

  test('a\\n(b)', () => {
    let source = 'a\n(b)'
    let expected = statements(call(a, [b]))
    expect(parse(scan(source))).toEqual(expected)
  })

  test('a;;;[b]', () => {
    let source = 'a;;;[b]'
    let expected = statements(
      a,
      new nodes.ArrayLiteral([new nodes.ArrayElement(null, b)]),
    )
    expect(parse(scan(source))).toEqual(expected)
  })

  test('a\\n[b]', () => {
    let source = 'a\n[b]'
    let expected = statements(new nodes.ArrayAccess(a, b))
    expect(parse(scan(source))).toEqual(expected)
  })
})

describe('parse optional semis between declarations', () => {
  test('var a var b', () => {
    let source = 'var a var b'
    let expected = [
      new nodes.VarDeclaration('a', null, null),
      new nodes.VarDeclaration('b', null, null),
    ]
    expect(parse(scan(source))).toEqual(expected)
  })

  test('var a;;;var b', () => {
    let source = 'var a;;;var b'
    let expected = [
      new nodes.VarDeclaration('a', null, null),
      new nodes.VarDeclaration('b', null, null),
    ]
    expect(parse(scan(source))).toEqual(expected)
  })

  test('fun a(){}fun b(){}', () => {
    let source = 'fun a(){}fun b(){}'
    let expected = [
      new nodes.FunctionDeclaration('a', [], null, block()),
      new nodes.FunctionDeclaration('b', [], null, block()),
    ]
    expect(parse(scan(source))).toEqual(expected)
  })

  test('fun a(){};;;fun b(){}', () => {
    let source = 'fun a(){};;;fun b(){}'
    let expected = [
      new nodes.FunctionDeclaration('a', [], null, block()),
      new nodes.FunctionDeclaration('b', [], null, block()),
    ]
    expect(parse(scan(source))).toEqual(expected)
  })

  test('class A{}class B{}', () => {
    let source = 'class A{}class B{}'
    let expected = [
      new nodes.ClassDeclaration('A', null, [], null, [], null, [], false),
      new nodes.ClassDeclaration('B', null, [], null, [], null, [], false),
    ]
    expect(parse(scan(source))).toEqual(expected)
  })

  test('class A{};;;class B{}', () => {
    let source = 'class A{};;;class B{}'
    let expected = [
      new nodes.ClassDeclaration('A', null, [], null, [], null, [], false),
      new nodes.ClassDeclaration('B', null, [], null, [], null, [], false),
    ]
    expect(parse(scan(source))).toEqual(expected)
  })
})

describe('parse optional semis between block statements', () => {
  test('if (a) {1 2}', () => {
    let source = 'if (a) {1 2}'
    let expected = [
      new nodes.If(
        a,
        block(
          new nodes.ExpressionStatement(number(1)),
          new nodes.ExpressionStatement(number(2)),
        ),
        null,
      ),
    ]
    expect(parse(scan(source))).toEqual(expected)
  })
})

describe('parse optional semis between block statements', () => {
  test('if (a) {1;;;2}', () => {
    let source = 'if (a) {1;;;2}'
    let expected = [
      new nodes.If(
        a,
        block(
          new nodes.ExpressionStatement(number(1)),
          new nodes.ExpressionStatement(number(2)),
        ),
        null,
      ),
    ]
    expect(parse(scan(source))).toEqual(expected)
  })
})
