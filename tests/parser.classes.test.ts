// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import * as nodes from '../nodes'
import * as types from '../types'

function ast(source: string) {
  return parse(scan(source))
}

function block(...body: nodes.Stmt[]) {
  return new nodes.Block(body)
}

function classDeclaration(
  name: string,
  {
    params = [],
    constructorVisibility = null,
    superclass,
    implements_ = [],
    members = [],
    isAbstract = false,
  }: {
    params?: nodes.ClassParam[]
    constructorVisibility?: nodes.Visibility
    superclass?: nodes.ClassSuperclass
    implements_?: string[]
    members?: nodes.ClassMember[]
    isAbstract?: boolean
  } = {},
) {
  return new nodes.ClassDeclaration(
    name,
    constructorVisibility,
    params,
    superclass ?? null,
    implements_,
    members,
    isAbstract,
  )
}

function classParam(
  name: string,
  {
    isFinal = false,
    visibility = null,
    isReadonly = false,
    type = null,
    initializer = null,
  }: {
    isFinal?: boolean
    visibility?: nodes.Visibility
    isReadonly?: boolean
    type?: types.Type | null
    initializer?: nodes.Expr | null
  } = {},
) {
  return new nodes.ClassParam(
    isFinal,
    visibility,
    isReadonly,
    name,
    type,
    initializer,
  )
}

describe('class declarations', () => {
  test('class A {}', () => {
    let source = 'class A {}'
    let expected = [classDeclaration('A')]
    expect(ast(source)).toEqual(expected)
  })

  test('class A(b) {}', () => {
    let source = 'class A(b) {}'
    let expected = [
      classDeclaration('A', {
        params: [classParam('b')],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A(b: number|string = 5, final public readonly c: bool,) {}', () => {
    let source =
      'class A(b: number|string = 5, final public readonly c: bool,) {}'
    let expected = [
      classDeclaration('A', {
        params: [
          classParam('b', {
            type: new types.Union([new types.Number(), new types.String()]),
            initializer: new nodes.NumberLiteral('5'),
          }),
          classParam('c', {
            isFinal: true,
            visibility: 'public',
            isReadonly: true,
            type: new types.Boolean(),
          }),
        ],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A extends B {}', () => {
    let source = 'class A extends B {}'
    let expected = [
      classDeclaration('A', {
        superclass: new nodes.ClassSuperclass('B', []),
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A(a) extends B(a()) {}', () => {
    let source = 'class A(a) extends B(a()) {}'
    let expected = [
      classDeclaration('A', {
        params: [classParam('a')],
        superclass: new nodes.ClassSuperclass('B', [
          new nodes.Call(new nodes.Identifier('a'), []),
        ]),
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A private() {}', () => {
    let source = 'class A private() {}'
    let expected = [
      classDeclaration('A', {
        constructorVisibility: 'private',
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A private(a) {}', () => {
    let source = 'class A private(a) {}'
    let expected = [
      classDeclaration('A', {
        params: [classParam('a')],
        constructorVisibility: 'private',
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A implements B {}', () => {
    let source = 'class A implements B {}'
    let expected = [
      classDeclaration('A', {
        implements_: ['B'],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A implements B, C, D, {}', () => {
    let source = 'class A implements B, C, D {}'
    let expected = [
      classDeclaration('A', {
        implements_: ['B', 'C', 'D'],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A extends B implements C, D {}', () => {
    let source = 'class A extends B implements C, D {}'
    let expected = [
      classDeclaration('A', {
        superclass: new nodes.ClassSuperclass('B', []),
        implements_: ['C', 'D'],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { init { echo "hello"; } }', () => {
    let source = 'class A { init { echo "hello"; } }'
    let expected = [
      classDeclaration('A', {
        members: [
          new nodes.ClassInitializer(
            block(new nodes.Echo(new nodes.StringLiteral('hello'))),
          ),
        ],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { init { 1; } init { 2; } }', () => {
    let source = 'class A { init { 1; } init { 2; } }'
    let expected = [
      classDeclaration('A', {
        members: [
          new nodes.ClassInitializer(
            block(new nodes.ExpressionStatement(new nodes.NumberLiteral('1'))),
          ),
          new nodes.ClassInitializer(
            block(new nodes.ExpressionStatement(new nodes.NumberLiteral('2'))),
          ),
        ],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test.todo('final class A {}', () => {})
  test.todo('readonly class A {}', () => {})
})
