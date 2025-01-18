// @ts-ignore
import { expect, test, describe } from 'bun:test'
import * as n from '../nodes'
import * as types from '../types'
import compile from './compiler'
import VoidVisitor from './VoidVisitor'
import { b, t } from '../builder'
import { TestSymbols } from '../symbols'
import { TypeCheckError } from './TypeCheckVisitor'

describe('typeof: literals', () => {
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

describe('typeof: array literal', () => {
  function check(src: string, type: types.Type) {
    let ast = compile(src, {})
    let stmt = ast.statements[0] as n.ExpressionStatement
    let expr = stmt.expression as n.ArrayLiteral
    expect(expr.type?.equals(type)).toBe(true)
  }
  test('[]', () => check('[]', t.array(t.void())))
  test('[1]', () => check('[1]', t.array(t.int())))
  test('[1,2]', () => check('[1,2]', t.array(t.int())))
  test('[1+2]', () => check('[1+2]', t.array(t.int())))
})

describe('typeof: array access', () => {
  let symbols = new TestSymbols()
  symbols.add('a', b.var('a', t.array(t.int())))
  function check(src: string, type: types.Type) {
    let ast = compile(src, { symbols })
    let stmt = ast.statements[0] as n.ExpressionStatement
    let expr = stmt.expression as n.ArrayLiteral
    expect(expr.type?.equals(type)).toBe(true)
  }
  test('a[0]', () => check('a[0]', t.int()))
})

describe('typeof: ternary operator', () => {
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

describe('typeof: match expression', () => {
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

describe('typeof: call expression', () => {
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

describe('typeof: binary expression', () => {
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

describe('typeof: unary expression', () => {
  const symbols = new TestSymbols()
  symbols.add('a', b.var('a', t.int()))
  symbols.add('c', b.var('c', t.float()))
  function check(src: string, type: types.Type) {
    let ast = compile(src, { symbols })
    let stmt = ast.statements[0] as n.ExpressionStatement
    let expr = stmt.expression as n.Unary
    expect(expr.type?.equals(type)).toBe(true)
  }
  test('!"hello"', () => check('!"hello"', t.bool()))
  test('-a', () => check('-a', t.int()))
  test('+a', () => check('+a', t.int()))
  test('-c', () => check('-c', t.float()))
  test('+c', () => check('+c', t.float()))
  test('--a', () => check('--a', t.int()))
  test('++a', () => check('++a', t.int()))
  test('--c', () => check('--c', t.float()))
  test('++c', () => check('++c', t.float()))
})

describe('typeof: postfix expression', () => {
  const symbols = new TestSymbols()
  symbols.add('a', b.var('a', t.int()))
  symbols.add('c', b.var('c', t.float()))
  function check(src: string, type: types.Type) {
    let ast = compile(src, { symbols })
    let stmt = ast.statements[0] as n.ExpressionStatement
    let expr = stmt.expression as n.Unary
    expect(expr.type?.equals(type)).toBe(true)
  }
  test('a--', () => check('a--', t.int()))
  test('a++', () => check('a++', t.int()))
  test('c--', () => check('c--', t.float()))
  test('c++', () => check('c++', t.float()))
})

describe('typeof: assignment expression', () => {
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

describe('typeof: clone expression', () => {
  function check(src: string, type: types.Type) {
    let ast = compile(src)
    let stmt = ast.statements[0] as n.ExpressionStatement
    let expr = stmt.expression as n.Clone
    expect(expr.type?.equals(type)).toBe(true)
  }
  test('clone 1', () => check('clone 1', t.int()))
})

test.todo('throw')
test.todo('pipeline')
