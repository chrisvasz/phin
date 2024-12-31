// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import * as nodes from '../nodes'
import * as types from '../types'
import { TokenType } from '../token'

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
    interfaces = [],
    iterates = null,
    members = [],
    isAbstract = false,
  }: {
    params?: Array<nodes.Param | nodes.ClassProperty>
    constructorVisibility?: nodes.Visibility
    superclass?: nodes.ClassSuperclass
    interfaces?: string[]
    iterates?: nodes.Identifier | null
    members?: nodes.ClassMember[]
    isAbstract?: boolean
  } = {},
): nodes.ClassDeclaration {
  return new nodes.ClassDeclaration(
    name,
    constructorVisibility,
    params,
    superclass ?? null,
    interfaces,
    iterates,
    members,
    isAbstract,
  )
}

function param(
  name: string,
  type: types.Type | null = null,
  initializer: nodes.Expr | null = null,
) {
  return new nodes.Param(name, type, initializer)
}

function classProperty(
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
  return new nodes.ClassProperty(
    isFinal,
    visibility,
    false, // TODO
    isReadonly,
    name,
    type,
    initializer,
  )
}

describe('parse class declarations', () => {
  test('class A {}', () => {
    let source = 'class A {}'
    let expected = [classDeclaration('A')]
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
        params: [param('a')],
        superclass: new nodes.ClassSuperclass('B', [
          new nodes.Call(new nodes.Identifier('a'), []),
        ]),
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A implements B {}', () => {
    let source = 'class A implements B {}'
    let expected = [
      classDeclaration('A', {
        interfaces: ['B'],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A implements B, C, D, {}', () => {
    let source = 'class A implements B, C, D {}'
    let expected = [
      classDeclaration('A', {
        interfaces: ['B', 'C', 'D'],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A extends B implements C, D {}', () => {
    let source = 'class A extends B implements C, D {}'
    let expected = [
      classDeclaration('A', {
        superclass: new nodes.ClassSuperclass('B', []),
        interfaces: ['C', 'D'],
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

describe('parse class params/constructor', () => {
  test('class A(b) {}', () => {
    let source = 'class A(b) {}'
    let expected = [
      classDeclaration('A', {
        params: [param('b')],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A(var b) {}', () => {
    let source = 'class A(var b) {}'
    let expected = [
      classDeclaration('A', {
        params: [classProperty('b')],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A(val b) {}', () => {
    let source = 'class A(val b) {}'
    let expected = [
      classDeclaration('A', {
        params: [classProperty('b', { isReadonly: true })],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A(b: number|string = 5, final public var c: bool,) {}', () => {
    let source = 'class A(b: number|string = 5, final public var c: bool,) {}'
    let expected = [
      classDeclaration('A', {
        params: [
          param(
            'b',
            new types.Union([new types.Number(), new types.String()]),
            new nodes.NumberLiteral('5'),
          ),
          classProperty('c', {
            isFinal: true,
            visibility: 'public',
            type: new types.Boolean(),
          }),
        ],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A(-var b) {}', () => {
    let source = 'class A(-var b) {}'
    let expected = [
      classDeclaration('A', {
        params: [classProperty('b', { visibility: 'private' })],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A(-var b: number) {}', () => {
    let source = 'class A(-var b: number) {}'
    let expected = [
      classDeclaration('A', {
        params: [
          classProperty('b', {
            visibility: 'private',
            type: new types.Number(),
          }),
        ],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A(b, +var c) {}', () => {
    let source = 'class A(b, +var c) {}'
    let expected = [
      classDeclaration('A', {
        params: [param('b'), classProperty('c', { visibility: 'public' })],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A(b, +var c: number=5) {}', () => {
    let source = 'class A(b, +var c: number=5) {}'
    let expected = [
      classDeclaration('A', {
        params: [
          param('b'),
          classProperty('c', {
            visibility: 'public',
            type: new types.Number(),
            initializer: new nodes.NumberLiteral('5'),
          }),
        ],
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

  test('class A -() {}', () => {
    let source = 'class A -() {}'
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
        params: [param('a')],
        constructorVisibility: 'private',
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse class properties', () => {
  test('class A { var b; }', () => {
    let source = 'class A { var b; }'
    let expected = [
      classDeclaration('A', {
        members: [classProperty('b')],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { val b; }', () => {
    let source = 'class A { val b; }'
    let expected = [
      classDeclaration('A', {
        members: [classProperty('b', { isReadonly: true })],
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse class iterates', () => {
  test('class A iterates a {}', () => {
    let source = 'class A iterates a {}'
    let expected = [
      classDeclaration('A', {
        iterates: new nodes.Identifier('a'),
      }),
    ]
    expect(ast(source)).toEqual(expected)
  })
})
