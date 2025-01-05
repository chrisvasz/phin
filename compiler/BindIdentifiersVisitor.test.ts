// @ts-ignore
import { expect, test, describe } from 'bun:test'
import * as nodes from '../nodes'
import { b } from '../parser/parser.builder'
import BindIdentifiersVisitor from './BindIdentifiersVisitor'
import ParseError from '../parser/ParseError'
import parse from '../parser/parser'
import scan from '../scanner'
import VoidVisitor from './VoidVisitor'
import { EnvironmentKind } from '../parser/environment'

function ast(source: string) {
  return parse(scan(source), {
    buildEnvironment: true,
  })
}

function checkIdentifierType(
  ast: nodes.Program,
  name: string,
  kind: EnvironmentKind,
) {
  let calls = 0
  let check = new (class extends VoidVisitor {
    override visitIdentifier(node: nodes.Identifier): void {
      calls++
      expect(node.name).toBe(name)
      expect(node.kind).toBe(kind)
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
    expect(() => visitor.visitProgram(program)).toThrow(
      new ParseError('Undeclared identifier: b'),
    )
  })

  test('a; fun a() {}', () => {
    let source = 'a; fun a() {}'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visitProgram(program)).not.toThrow()
    checkIdentifierType(program, 'a', EnvironmentKind.Function)
  })

  test('A; class A {}', () => {
    let source = 'A; class A {}'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visitProgram(program)).not.toThrow()
    checkIdentifierType(program, 'A', EnvironmentKind.Class)
  })
})

describe('var at global scope', () => {
  test('a; var a;', () => {
    let source = 'a; var a;'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visitProgram(program)).toThrow(
      new ParseError('Undeclared identifier: a'),
    )
  })

  test('var a; a;', () => {
    let source = 'var a; a;'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visitProgram(program)).not.toThrow()
    checkIdentifierType(program, 'a', EnvironmentKind.Variable)
  })
})

describe('var in function scope', () => {
  test('fun a() { a; }', () => {
    let source = 'fun a() { a; }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visitProgram(program)).not.toThrow()
    checkIdentifierType(program, 'a', EnvironmentKind.Function)
  })

  test('fun a() { b; var b; }', () => {
    let source = 'fun a() { b; var b; }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visitProgram(program)).toThrow(
      new ParseError('Undeclared identifier: b'),
    )
  })

  test('fun a() { var b; b; }', () => {
    let source = 'fun a() { var b; b; }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visitProgram(program)).not.toThrow()
    checkIdentifierType(program, 'b', EnvironmentKind.Variable)
  })

  test('fun a() { { var b; } b; }', () => {
    let source = 'fun a() { { var b; } b; }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visitProgram(program)).not.toThrow()
    checkIdentifierType(program, 'b', EnvironmentKind.Variable)
  })

  test('fun a() { { var b; } } b;', () => {
    let source = 'fun a() { { var b; } } b;'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visitProgram(program)).toThrow(
      new ParseError('Undeclared identifier: b'),
    )
  })

  test('fun a(b) { b; }', () => {
    let source = 'fun a(b) { b; }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visitProgram(program)).not.toThrow()
    checkIdentifierType(program, 'b', EnvironmentKind.Variable)
  })
})

describe('classes', () => {
  test('class A(a) { fun b() => a }', () => {
    let source = 'class A(a) { fun b() => a }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visitProgram(program)).toThrow(
      new ParseError('Undeclared identifier: a'),
    )
  })

  test('class A(var a) { fun b() => a }', () => {
    let source = 'class A(var a) { fun b() => a }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visitProgram(program)).not.toThrow()
    checkIdentifierType(program, 'a', EnvironmentKind.ClassProperty)
  })

  test('class A { const B = 1; fun a() => B }', () => {
    let source = 'class A { const B = 1; fun a() => B }'
    let program = ast(source)
    let visitor = new BindIdentifiersVisitor()
    expect(() => visitor.visitProgram(program)).not.toThrow()
    checkIdentifierType(program, 'B', EnvironmentKind.ClassConst)
  })
})
