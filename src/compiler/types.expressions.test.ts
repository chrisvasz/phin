// @ts-ignore
import { expect, test, describe } from 'bun:test'
import * as n from '../nodes'
import * as types from '../types'
import compile from './compiler'
import VoidVisitor from './VoidVisitor'
import { b, t } from '../builder'
import { TestSymbols } from '../symbols'
import { TypeCheckError } from './TypeCheckVisitor'

describe('typecheck: literals', () => {
  function check(src: string, type: types.Type) {
    let ast = compile(src, {})
    let stmt = ast.statements[0] as n.ExpressionStatement
    let expr = stmt.expression as n.Node
    expect(expr.type?.equals(type)).toBe(true)
  }
  test('null', () => check('null', t.null()))
  test('""', () => check('""', t.string()))
  test('true', () => check('true', t.true()))
  test('false', () => check('false', t.false()))
  test('1', () => check('1', t.int()))
  test('1.0', () => check('1.0', t.float()))
  test('"${1}"', () => check('"${1}"', t.string()))
  test('(1)', () => check('(1)', t.int()))
})

describe('typecheck: ternary operator', () => {
  function check(ast: n.Program, expected: types.Type) {
    let calls = 0
    let visitor = new (class extends VoidVisitor {
      override visitTernary(node: n.Ternary): void {
        calls++
        expect(node.type?.equals(expected)).toBe(true)
      }
    })()
    visitor.visitProgram(ast)
    expect(calls).toBe(1)
  }

  test('true ? null : null', () => {
    let src = 'true ? null : null'
    check(compile(src), t.null())
  })

  test('true ? "" : false', () => {
    let src = 'true ? "" : false'
    check(compile(src), t.union(t.string(), t.false()))
  })
})

describe('typecheck: match expression', () => {
  function check(ast: n.Program, expected: types.Type) {
    let calls = 0
    let visitor = new (class extends VoidVisitor {
      override visitMatch(node: n.Match): void {
        calls++
        expect(node.type?.equals(expected)).toBe(true)
      }
    })()
    visitor.visitProgram(ast)
    expect(calls).toBe(1)
  }

  test('match (1) { 1 => null }', () => {
    let src = 'match (1) { 1 => null }'
    check(compile(src), t.null())
  })

  test('match (1) { 1 => "", 2 => null }', () => {
    let src = 'match (1) { 1 => "", 2 => null }'
    check(compile(src), t.union(t.string(), t.null()))
  })

  test('match (1) { 1 => true, default => true }', () => {
    let src = 'match (1) { 1 => true, default => true }'
    check(compile(src), t.true())
  })

  test('match (1) { 1 => true, default => "" }', () => {
    let src = 'match (1) { 1 => true, default => "" }'
    check(compile(src), t.union(t.true(), t.string()))
  })
})

describe('typecheck: call expression', () => {
  let a = new n.FunctionDeclaration('a', [], t.int(), b.block())
  a.type = t.fun([], t.int())
  let five = b.var('five', t.int())

  test('a()', () => {
    let symbols = new TestSymbols()
    symbols.add('a', a)
    let src = 'a()'
    let ast = compile(src, { symbols })
    let stmt = ast.statements[0] as n.ExpressionStatement
    expect(stmt.expression.type?.equals(t.int())).toBe(true)
  })

  test('five()', () => {
    let symbols = new TestSymbols()
    symbols.add('five', five)
    let src = 'five()'
    expect(() => compile(src, { symbols })).toThrow(
      new TypeCheckError('Cannot call non-function'),
    )
  })
})

describe('typecheck: binary expression', () => {
  function check(src: string, type: types.Type) {
    let ast = compile(src)
    let calls = 0
    let visitor = new (class extends VoidVisitor {
      override visitBinary(node: n.Binary): void {
        calls++
        expect(node.type?.equals(type)).toBe(true)
      }
    })()
    visitor.visitProgram(ast)
    expect(calls).toBe(1)
  }
  let map = {
    '1 == 2': t.bool(),
    '1 != 2': t.bool(),
    '1 === 2': t.bool(),
    '1 !== 2': t.bool(),
    '1 < 2': t.bool(),
    '1 <= 2': t.bool(),
    '1 > 2': t.bool(),
    '1 >= 2': t.bool(),
    '1 && 2': t.bool(),
    '1 || 2': t.bool(),
    '"" +. ""': t.string(),
  }
  for (let [src, type] of Object.entries(map)) {
    test(src, () => check(src, type))
  }
})

describe('typecheck: assignment expression types', () => {
  const symbols = new TestSymbols()
  symbols.add('a', b.var('a', t.any()))
  function check(src: string, type: types.Type) {
    let ast = compile(src, { symbols })
    let stmt = ast.statements[0] as n.ExpressionStatement
    let expr = stmt.expression as n.Assign
    expect(expr.type?.equals(type)).toBe(true)
  }
  test('a = 1', () => check('a = 1', t.int()))
  test('a = "1"', () => check('a = "1"', t.string()))
  test('a = true', () => check('a = true', t.true()))
})

test.todo('new')
test.todo('clone')
test.todo('throw')
test.todo('unary')
test.todo('prefix')
test.todo('postfix')
test.todo('array literal')
test.todo('array access')
test.todo('this,super')
test.todo('get, optional get')
test.todo('pipeline')
