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

describe('class declarations', () => {
  test('class A {}', () => {
    let source = 'class A {}'
    let expected = [new nodes.ClassDeclaration('A', [], null, [], [])]
    expect(ast(source)).toEqual(expected)
  })

  test('class A(b) {}', () => {
    let source = 'class A(b) {}'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [new nodes.ClassParam(false, null, false, 'b', null, null)],
        null,
        [],
        [],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A(b: number|string = 5, final public readonly c: bool,) {}', () => {
    let source =
      'class A(b: number|string = 5, final public readonly c: bool,) {}'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [
          new nodes.ClassParam(
            false,
            null,
            false,
            'b',
            new types.Union([new types.Number(), new types.String()]),
            new nodes.NumberLiteral('5'),
          ),
          new nodes.ClassParam(
            true,
            'public',
            true,
            'c',
            new types.Boolean(),
            null,
          ),
        ],
        null,
        [],
        [],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A extends B {}', () => {
    let source = 'class A extends B {}'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        new nodes.ClassSuperclass('B', []),
        [],
        [],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A(a) extends B(a()) {}', () => {
    let source = 'class A(a) extends B(a()) {}'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [new nodes.ClassParam(false, null, false, 'a', null, null)],
        new nodes.ClassSuperclass('B', [
          new nodes.Call(new nodes.Identifier('a'), []),
        ]),
        [],
        [],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A implements B {}', () => {
    let source = 'class A implements B {}'
    let expected = [new nodes.ClassDeclaration('A', [], null, ['B'], [])]
    expect(ast(source)).toEqual(expected)
  })

  test('class A implements B, C, D, {}', () => {
    let source = 'class A implements B, C, D {}'
    let expected = [
      new nodes.ClassDeclaration('A', [], null, ['B', 'C', 'D'], []),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A extends B implements C, D {}', () => {
    let source = 'class A extends B implements C, D {}'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        new nodes.ClassSuperclass('B', []),
        ['C', 'D'],
        [],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { init { echo "hello"; } }', () => {
    let source = 'class A { init { echo "hello"; } }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [
          new nodes.ClassInitializer(
            block(new nodes.Echo(new nodes.StringLiteral('hello'))),
          ),
        ],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { init { 1; } init { 2; } }', () => {
    let source = 'class A { init { 1; } init { 2; } }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [
          new nodes.ClassInitializer(
            block(new nodes.ExpressionStatement(new nodes.NumberLiteral('1'))),
          ),
          new nodes.ClassInitializer(
            block(new nodes.ExpressionStatement(new nodes.NumberLiteral('2'))),
          ),
        ],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test.todo('final class A {}', () => {})
  test.todo('readonly class A {}', () => {})
})

describe('class methods', () => {
  test('class A { fun b() {} }', () => {
    let source = 'class A { fun b() {} }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [new nodes.ClassMethod(false, null, false, 'b', [], null, block())],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { fun b(c: number|string = 3,): true => true }', () => {
    let source = 'class A { fun b(c: number|string = 3,): true => true }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [
          new nodes.ClassMethod(
            false,
            null,
            false,
            'b',
            [
              new nodes.Param(
                'c',
                new types.Union([new types.Number(), new types.String()]),
                new nodes.NumberLiteral('3'),
              ),
            ],
            new types.True(),
            new nodes.BooleanLiteral(true),
          ),
        ],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { fun b() { return 3; } }', () => {
    let source = 'class A { fun b() { return 3; } }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [
          new nodes.ClassMethod(
            false,
            null,
            false,
            'b',
            [],
            null,
            block(new nodes.Return(new nodes.NumberLiteral('3'))),
          ),
        ],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { public fun b() {} }', () => {
    let source = 'class A { public fun b() {} }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [new nodes.ClassMethod(false, 'public', false, 'b', [], null, block())],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { static fun b() {} }', () => {
    let source = 'class A { static fun b() {} }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [new nodes.ClassMethod(false, null, true, 'b', [], null, block())],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { final fun b() {} }', () => {
    let source = 'class A { final fun b() {} }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [new nodes.ClassMethod(true, null, false, 'b', [], null, block())],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { final private static fun b() {} }', () => {
    let source = 'class A { final private static fun b() {} }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [new nodes.ClassMethod(true, 'private', true, 'b', [], null, block())],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })
})

describe('class constants', () => {
  test('class A { const b = 3; }', () => {
    let source = 'class A { const b = 3; }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [
          new nodes.ClassConst(
            false,
            null,
            false,
            'b',
            null,
            new nodes.NumberLiteral('3'),
          ),
        ],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { protected const b: int|string = 4; }', () => {
    let source = 'class A { protected const b: int|string = 4; }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [
          new nodes.ClassConst(
            false,
            'protected',
            false,
            'b',
            new types.Union([new types.Int(), new types.String()]),
            new nodes.NumberLiteral('4'),
          ),
        ],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { static const b = 4; }', () => {
    let source = 'class A { static const b = 4; }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [
          new nodes.ClassConst(
            false,
            null,
            true,
            'b',
            null,
            new nodes.NumberLiteral('4'),
          ),
        ],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { final const b = 4; }', () => {
    let source = 'class A { final const b = 4; }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [
          new nodes.ClassConst(
            true,
            null,
            false,
            'b',
            null,
            new nodes.NumberLiteral('4'),
          ),
        ],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { final private static const b = 4; }', () => {
    let source = 'class A { final private static const b = 4; }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [
          new nodes.ClassConst(
            true,
            'private',
            true,
            'b',
            null,
            new nodes.NumberLiteral('4'),
          ),
        ],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })
})

describe('class properties', () => {
  test('class A { var b: number = 3; }', () => {
    let source = 'class A { var b: number = 3; }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [
          new nodes.ClassProperty(
            false,
            null,
            false,
            'b',
            new types.Number(),
            new nodes.NumberLiteral('3'),
          ),
        ],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { private var b; }', () => {
    let source = 'class A { private var b; }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [new nodes.ClassProperty(false, 'private', false, 'b', null, null)],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { static var b; }', () => {
    let source = 'class A { static var b; }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [new nodes.ClassProperty(false, null, true, 'b', null, null)],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { final var b; }', () => {
    let source = 'class A { final var b; }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [new nodes.ClassProperty(true, null, false, 'b', null, null)],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('class A { final private static var b; }', () => {
    let source = 'class A { final private static var b; }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [new nodes.ClassProperty(true, 'private', true, 'b', null, null)],
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test.todo('readonly properties somehow')
})

describe('abstract', () => {
  test('abstract class A {}', () => {
    let source = 'abstract class A {}'
    let expected = [new nodes.ClassDeclaration('A', [], null, [], [], true)]
    expect(ast(source)).toEqual(expected)
  })

  test('abstract class A { abstract fun b(): number; }', () => {
    let source = 'abstract class A { abstract fun b(): number; }'
    let expected = [
      new nodes.ClassDeclaration(
        'A',
        [],
        null,
        [],
        [
          new nodes.ClassAbstractMethod(
            null,
            false,
            'b',
            [],
            new types.Number(),
          ),
        ],
        true,
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })
})

describe('get expressions', () => {
  test('a.b', () => {
    let source = 'a.b'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.Get(new nodes.Identifier('a'), 'b'),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('a?.b', () => {
    let source = 'a?.b'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.OptionalGet(new nodes.Identifier('a'), 'b'),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('a.b.c', () => {
    let source = 'a.b.c'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.Get(new nodes.Get(new nodes.Identifier('a'), 'b'), 'c'),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('a.b?.c.d', () => {
    let source = 'a.b?.c.d'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.Get(
          new nodes.OptionalGet(
            new nodes.Get(new nodes.Identifier('a'), 'b'),
            'c',
          ),
          'd',
        ),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('a()?.b(1,2).c', () => {
    let source = 'a()?.b(1,2).c'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.Get(
          new nodes.Call(
            new nodes.OptionalGet(
              new nodes.Call(new nodes.Identifier('a'), []),
              'b',
            ),
            [new nodes.NumberLiteral('1'), new nodes.NumberLiteral('2')],
          ),
          'c',
        ),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('this.hello', () => {
    let source = 'this.hello'
    let expected = [
      new nodes.ExpressionStatement(new nodes.Get(new nodes.This(), 'hello')),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('super.hello', () => {
    let source = 'super.hello'
    let expected = [
      new nodes.ExpressionStatement(new nodes.Get(new nodes.Super(), 'hello')),
    ]
    expect(ast(source)).toEqual(expected)
  })
})
