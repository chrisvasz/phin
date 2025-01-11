// @ts-ignore
import { expect, test, describe } from 'bun:test'
import * as n from './nodes'
import compile, { resolveUndeclaredIdentifiersToVariables } from './compiler'
import * as t from './types'
import VoidVisitor from './compiler/VoidVisitor'

describe('literal types', () => {
  function check(src: string, type: typeof t.Type) {
    let ast = compile(src, {
      resolveUndeclaredIdentifiers: resolveUndeclaredIdentifiersToVariables,
    })
    let stmt = ast.statements[0] as n.ExpressionStatement
    let expr = stmt.expression as n.TypedNode
    expect(expr.type()).toBeInstanceOf(type)
  }
  test('null', () => check('null', t.Null))
  test('""', () => check('""', t.String))
  test('true', () => check('true', t.True))
  test('false', () => check('false', t.False))
  test('1', () => check('1', t.Number))
  test('"$a"', () => check('"$a"', t.String))
  test('(1)', () => check('(1)', t.Number))
})

describe('assignment expression types', () => {
  function check(src: string, type: typeof t.Type) {
    let ast = compile(src, {
      resolveUndeclaredIdentifiers: resolveUndeclaredIdentifiersToVariables,
    })
    let stmt = ast.statements[0] as n.ExpressionStatement
    let expr = stmt.expression as n.Assign
    expect(expr.type()).toBeInstanceOf(type)
  }
  test('a = 1', () => check('a = 1', t.Number))
  test('a = "1"', () => check('a = "1"', t.String))
  test('a = true', () => check('a = true', t.True))
})

describe('binary expression types', () => {
  function check(src: string, type: typeof t.Type) {
    let ast = compile(src)
    let calls = 0
    let visitor = new (class extends VoidVisitor {
      override visitBinary(node: n.Binary): void {
        calls++
        expect(node.type()).toBeInstanceOf(type)
      }
    })()
    visitor.visitProgram(ast)
    expect(calls).toBe(1)
  }
  let map = {
    '1 == 2': t.Boolean,
    '1 != 2': t.Boolean,
    '1 === 2': t.Boolean,
    '1 !== 2': t.Boolean,
    '1 < 2': t.Boolean,
    '1 <= 2': t.Boolean,
    '1 > 2': t.Boolean,
    '1 >= 2': t.Boolean,
    '1 && 2': t.Boolean,
    '1 || 2': t.Boolean,
    '"" +. ""': t.String,
  }
  for (let [src, type] of Object.entries(map)) {
    test(src, () => check(src, type))
  }
})

describe('match expression types', () => {
  test('match (1) {}', () => {
    let src = 'match (1) {}'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.ExpressionStatement
    let match = stmt.expression as n.Match
    expect(match.type()).toBeInstanceOf(t.Void)
  })

  test('match (1) { 1 => 2 }', () => {
    let src = 'match (1) { 1 => 2 }'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.ExpressionStatement
    let match = stmt.expression as n.Match
    expect(match.type()).toBeInstanceOf(t.Number)
  })

  test('match (1) { 1 => "2" }', () => {
    let src = 'match (1) { 1 => "2" }'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.ExpressionStatement
    let match = stmt.expression as n.Match
    expect(match.type()).toBeInstanceOf(t.String)
  })

  test('match (1) { 1 => 2, 2 => 3 }', () => {
    let src = 'match (1) { 1 => 2, 2 => 3 }'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.ExpressionStatement
    let match = stmt.expression as n.Match
    expect(match.type()).toBeInstanceOf(t.Number)
  })

  test('match (1) { 1 => 2, 2 => "3" }', () => {
    let src = 'match (1) { 1 => 2, 2 => "3" }'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.ExpressionStatement
    let match = stmt.expression as n.Match
    let actual = match.type()
    expect(actual).toBeInstanceOf(t.Union)
    if (actual instanceof t.Union) {
      expect(actual.types[0]).toBeInstanceOf(t.Number)
      expect(actual.types[1]).toBeInstanceOf(t.String)
    }
  })
})

describe('call expression types', () => {
  test.todo('fun a(): true => true; a()', () => {
    let src = 'fun a(): true => true; a()'
    let ast = compile(src)
    let stmt = ast.statements[1] as n.ExpressionStatement
    let call = stmt.expression as n.Call
    expect(call.type()).toBeInstanceOf(t.True)
  })
})
