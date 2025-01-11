// @ts-ignore
import { expect, test, describe } from 'bun:test'
import * as n from '../nodes'
import compile, { resolveUndeclaredIdentifiersToVariables } from '.'
import * as t from '../types'
import VoidVisitor from './VoidVisitor'

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

describe('ternary expression types', () => {
  test('true ? 1 : 2', () => {
    let src = 'true ? 1 : 2'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.ExpressionStatement
    let ternary = stmt.expression as n.Ternary
    expect(ternary.type()).toBeInstanceOf(t.Number)
  })

  test('true ? 1 : "2"', () => {
    let src = 'true ? 1 : "2"'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.ExpressionStatement
    let ternary = stmt.expression as n.Ternary
    let actual = ternary.type()
    expect(actual).toBeInstanceOf(t.Union)
    if (actual instanceof t.Union) {
      expect(actual.types[0]).toBeInstanceOf(t.Number)
      expect(actual.types[1]).toBeInstanceOf(t.String)
    }
  })

  test('true ? null : null', () => {
    let src = 'true ? null : null'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.ExpressionStatement
    let ternary = stmt.expression as n.Ternary
    let actual = ternary.type()
    expect(actual).toBeInstanceOf(t.Null)
  })

  test('true ? "" : true', () => {
    let src = 'true ? "" : true'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.ExpressionStatement
    let ternary = stmt.expression as n.Ternary
    let actual = ternary.type()
    expect(actual).toBeInstanceOf(t.Union)
    if (actual instanceof t.Union) {
      expect(actual.types[0]).toBeInstanceOf(t.String)
      expect(actual.types[1]).toBeInstanceOf(t.True)
    }
  })
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

  test('match (1) { default => true }', () => {
    let src = 'match (1) { default => true }'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.ExpressionStatement
    let match = stmt.expression as n.Match
    expect(match.type()).toBeInstanceOf(t.True)
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

  test('match (1) { 1 => 2, default => "3" }', () => {
    let src = 'match (1) { 1 => 2, default => "3" }'
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

describe('function declaration types', () => {
  test('fun a(): int {}', () => {
    let src = 'fun a(): int {}'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.FunctionDeclaration
    let actual = stmt.type()
    expect(actual).toBeInstanceOf(t.Function)
    if (actual instanceof t.Function) {
      expect(actual.returnType).toBeInstanceOf(t.Int)
    }
  })

  test('fun a(): int|string {}', () => {
    let src = 'fun a(): int|string {}'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.FunctionDeclaration
    let actual = stmt.type()
    expect(actual).toBeInstanceOf(t.Function)
    if (actual instanceof t.Function) {
      let returnType = actual.returnType
      expect(returnType).toBeInstanceOf(t.Union)
      if (returnType instanceof t.Union) {
        expect(returnType.types[0]).toBeInstanceOf(t.Int)
        expect(returnType.types[1]).toBeInstanceOf(t.String)
      }
    }
  })

  test('fun a(b: string): int {}', () => {
    let src = 'fun a(b: string): int {}'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.FunctionDeclaration
    let actual = stmt.type()
    expect(actual).toBeInstanceOf(t.Function)
    if (actual instanceof t.Function) {
      expect(actual.returnType).toBeInstanceOf(t.Int)
      expect(actual.params[0]).toBeInstanceOf(t.String)
    }
  })

  test('fun a(b: string, c: bool): int {}', () => {
    let src = 'fun a(b: string, c: bool): int {}'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.FunctionDeclaration
    let actual = stmt.type()
    expect(actual).toBeInstanceOf(t.Function)
    if (actual instanceof t.Function) {
      expect(actual.returnType).toBeInstanceOf(t.Int)
      expect(actual.params[0]).toBeInstanceOf(t.String)
      expect(actual.params[1]).toBeInstanceOf(t.Boolean)
    }
  })

  test.todo('fun a() => ""', () => {
    // infer return type from expression
    let src = 'fun a() => ""'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.FunctionDeclaration
    let actual = stmt.type()
    expect(actual).toBeInstanceOf(t.Function)
    if (actual instanceof t.Function) {
      expect(actual.returnType).toBeInstanceOf(t.String)
    }
  })
})

describe('function expression types', () => {
  test('var a = fun(): int => 1', () => {
    let src = 'var a = fun(): int => 1'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.VarDeclaration
    let expr = stmt.initializer as n.FunctionExpression
    let actual = expr.type()
    expect(actual).toBeInstanceOf(t.Function)
    if (actual instanceof t.Function) {
      expect(actual.returnType).toBeInstanceOf(t.Int)
    }
  })

  test('var a = fun(b: string): int => 1', () => {
    let src = 'var a = fun(b: string): int => 1'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.VarDeclaration
    let expr = stmt.initializer as n.FunctionExpression
    let actual = expr.type()
    expect(actual).toBeInstanceOf(t.Function)
    if (actual instanceof t.Function) {
      expect(actual.returnType).toBeInstanceOf(t.Int)
      expect(actual.params[0]).toBeInstanceOf(t.String)
    }
  })

  // infer return type from expression
  test.todo('var a = fun () => ""', () => {
    let src = 'var a = fun () => ""'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.VarDeclaration
    let expr = stmt.initializer as n.FunctionExpression
    let actual = expr.type()
    expect(actual).toBeInstanceOf(t.Function)
    if (actual instanceof t.Function) {
      expect(actual.returnType).toBeInstanceOf(t.String)
    }
  })

  // infer return type from expression
  test.todo('var a = ""; var b = fun() => a', () => {
    let src = 'var a = ""; var b = fun() => a'
    let ast = compile(src)
    let stmt = ast.statements[1] as n.VarDeclaration
    let expr = stmt.initializer as n.FunctionExpression
    let actual = expr.type()
    expect(actual).toBeInstanceOf(t.Function)
    if (actual instanceof t.Function) {
      expect(actual.returnType).toBeInstanceOf(t.String)
    }
  })
})

describe('var declaration types', () => {
  test('var a: string', () => {
    let src = 'var a: string'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.VarDeclaration
    let actual = stmt.type()
    expect(actual).toBeInstanceOf(t.String)
  })

  // infers type from expression
  test('var a = ""', () => {
    let src = 'var a = ""'
    let ast = compile(src)
    let stmt = ast.statements[0] as n.VarDeclaration
    let actual = stmt.type()
    expect(actual).toBeInstanceOf(t.String)
  })

  // infers type from expression
  test('var a = ""; var b = a', () => {
    let src = 'var a = ""; var b = a'
    let ast = compile(src)
    let stmt = ast.statements[1] as n.VarDeclaration
    let actual = stmt.type()
    expect(actual).toBeInstanceOf(t.String)
  })
})

describe('identifier types', () => {
  test('var a: int = 1; a', () => {
    let src = 'var a: int = 1; a'
    let ast = compile(src)
    let stmt = ast.statements[1] as n.ExpressionStatement
    let id = stmt.expression as n.Identifier
    let actual = id.type()
    expect(actual).toBeInstanceOf(t.Int)
  })

  test('fun a(b: string): int => 1; a', () => {
    let src = 'fun a(b: string): int => 1; a'
    let ast = compile(src)
    let stmt = ast.statements[1] as n.ExpressionStatement
    let id = stmt.expression as n.Identifier
    let actual = id.type()
    expect(actual).toBeInstanceOf(t.Function)
    if (actual instanceof t.Function) {
      expect(actual.returnType).toBeInstanceOf(t.Int)
      expect(actual.params[0]).toBeInstanceOf(t.String)
    }
  })
})
