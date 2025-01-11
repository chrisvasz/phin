// @ts-ignore
import { expect, test, describe } from 'bun:test'
import * as n from '../nodes'
import BindIdentifiersVisitor from './BindIdentifiersVisitor'
import ParseError from '../parser/ParseError'
import parse from '../parser/parser'
import scan from '../scanner'
import VoidVisitor from './VoidVisitor'

function ast(source: string) {
  return parse(scan(source), {
    buildEnvironment: true,
  })
}

function checkIdentifierNode(ast: n.Program, name: string, node: unknown) {
  let calls = 0
  let check = new (class extends VoidVisitor {
    override visitIdentifier(identifier: n.Identifier): void {
      if (identifier.name !== name) return
      calls++
      expect(identifier.node).toBeInstanceOf(node)
    }
  })()
  check.visitProgram(ast)
  expect(calls).toBe(1)
}

describe('hoisting', () => {
  test('a;', () => {
    let source = 'b;'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).toThrow(
      new ParseError('Undeclared identifier: b'),
    )
  })

  test('a; fun a() {}', () => {
    let source = 'a; fun a() {}'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).not.toThrow()
    checkIdentifierNode(program, 'a', n.FunctionDeclaration)
  })

  test('A; class A {}', () => {
    let source = 'A; class A {}'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).not.toThrow()
    checkIdentifierNode(program, 'A', n.ClassDeclaration)
  })
})

describe('var at global scope', () => {
  test('a; var a;', () => {
    let source = 'a; var a;'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).toThrow(
      new ParseError('Undeclared identifier: a'),
    )
  })

  test('var a; a;', () => {
    let source = 'var a; a;'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).not.toThrow()
    checkIdentifierNode(program, 'a', n.VarDeclaration)
  })
})

describe('var in function scope', () => {
  test('fun a() { a; }', () => {
    let source = 'fun a() { a; }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).not.toThrow()
    checkIdentifierNode(program, 'a', n.FunctionDeclaration)
  })

  test('fun a() { b; var b; }', () => {
    let source = 'fun a() { b; var b; }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).toThrow(
      new ParseError('Undeclared identifier: b'),
    )
  })

  test('fun a() { var b; b; }', () => {
    let source = 'fun a() { var b; b; }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).not.toThrow()
    checkIdentifierNode(program, 'b', n.VarDeclaration)
  })

  test('fun a() { { var b; } b; }', () => {
    let source = 'fun a() { { var b; } b; }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).not.toThrow()
    checkIdentifierNode(program, 'b', n.VarDeclaration)
  })

  test('fun a() { { var b; } } b;', () => {
    let source = 'fun a() { { var b; } } b;'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).toThrow(
      new ParseError('Undeclared identifier: b'),
    )
  })

  test('fun a(b) { b; }', () => {
    let source = 'fun a(b) { b; }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).not.toThrow()
    checkIdentifierNode(program, 'b', n.Param)
  })

  test('var a = fun(b) => b', () => {
    let source = 'var a = fun(b) => b'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).not.toThrow()
    checkIdentifierNode(program, 'b', n.Param)
  })
})

describe('classes', () => {
  test('class A(a) { fun b() => a }', () => {
    let source = 'class A(a) { fun b() => a }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).toThrow(
      new ParseError('Undeclared identifier: a'),
    )
  })

  test('class A(var a) { fun b() => a }', () => {
    let source = 'class A(var a) { fun b() => a }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).not.toThrow()
    checkIdentifierNode(program, 'a', n.ClassProperty)
  })

  test('class A(var a) iterates a {}', () => {
    let source = 'class A(var a) iterates a {}'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).not.toThrow()
    checkIdentifierNode(program, 'a', n.ClassProperty)
  })

  test('class A { const B = 1; fun a() => B }', () => {
    let source = 'class A { const B = 1; fun a() => B }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).not.toThrow()
    checkIdentifierNode(program, 'B', n.ClassConst)
  })
})

describe('destructuring', () => {
  test('var a; var [b] = a; b;', () => {
    let source = 'var a; var [b] = a; b;'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).not.toThrow()
    checkIdentifierNode(program, 'b', n.DestructuringElement)
  })

  test('var a; foreach (a as [b]) { b; }', () => {
    let source = 'var a; foreach (a as [b]) { b; }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visit(program)).not.toThrow()
    checkIdentifierNode(program, 'b', n.DestructuringElement)
  })
})
