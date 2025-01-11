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
  test.only('match (1) { 1 => 2 }', () => {
    let src = 'match (1) { 1 => 2 }'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.ExpressionStatement
    let match = stmt.expression as n.Match
    expect(match.type()).toBeInstanceOf(t.Number)
  })

  test.only('match (1) { 1 => "2" }', () => {
    let src = 'match (1) { 1 => "2" }'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.ExpressionStatement
    let match = stmt.expression as n.Match
    expect(match.type()).toBeInstanceOf(t.String)
  })
})
