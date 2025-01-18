// @ts-ignore
import { expect, test, describe } from 'bun:test'
import * as n from '../nodes'
import * as types from '../types'
import compile from './compiler'
import { b, t } from '../builder'
import { TestSymbols } from '../symbols'
import { TypeCheckError } from './TypeCheckVisitor'

describe('typeof: class', () => {
  test('class A {} new A', () => {
    let ast = compile('class A {} new A', {})
    let stmt = ast.statements[1] as n.ExpressionStatement
    let expr = stmt.expression as n.New
    expect(expr).toBeInstanceOf(n.New)
    expect(expr.type).toBeInstanceOf(types.Instance)
    if (expr instanceof types.Instance) {
      expect(expr.node).toBe(ast.symbols.get('A'))
    }
  })

  test.todo('class A {} new A()')
})

describe('typeof: get expression', () => {
  test('class A { var b = "" } (new A).b', () => {
    let ast = compile('class A { var b = "" } (new A).b', {})
    let stmt = ast.statements[1] as n.ExpressionStatement
    let expr = stmt.expression as n.Get
    expect(expr).toBeInstanceOf(n.Get)
    expect(expr.type).toBe(t.string())
  })
})

describe('typeof: optional get expression', () => {
  test('class A { var b = "" } (new A)?.b', () => {
    let ast = compile('class A { var b = "" } (new A)?.b', {})
    let stmt = ast.statements[1] as n.ExpressionStatement
    let expr = stmt.expression as n.OptionalGet
    expect(expr).toBeInstanceOf(n.OptionalGet)
    expect(expr.type).toEqual(t.nullable(t.string()))
  })
})

test.todo('this,super')
