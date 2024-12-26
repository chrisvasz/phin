// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';
import * as types from '../type';

function ast(source: string) {
  return parse(scan(source));
}

describe('class declarations', () => {
  test('class A {}', () => {
    let source = 'class A {}';
    let expected = [new stmt.Class('A', [], null, [], [])];
    expect(ast(source)).toEqual(expected);
  });

  test('class A(b) {}', () => {
    let source = 'class A(b) {}';
    let expected = [
      new stmt.Class(
        'A',
        [new stmt.ClassParam('b', null, null, null, false, false)],
        null,
        [],
        [],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A(b: number|string = 5, final public readonly c: bool,) {}', () => {
    let source =
      'class A(b: number|string = 5, final public readonly c: bool,) {}';
    let expected = [
      new stmt.Class(
        'A',
        [
          new stmt.ClassParam(
            'b',
            new types.Union([new types.Number(), new types.String()]),
            new expr.NumberLiteral('5'),
            null,
            false,
            false,
          ),
          new stmt.ClassParam(
            'c',
            new types.Boolean(),
            null,
            'public',
            true,
            true,
          ),
        ],
        null,
        [],
        [],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A extends B {}', () => {
    let source = 'class A extends B {}';
    let expected = [
      new stmt.Class('A', [], new stmt.ClassSuperclass('B', []), [], []),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A(a) extends B(a()) {}', () => {
    let source = 'class A(a) extends B(a()) {}';
    let expected = [
      new stmt.Class(
        'A',
        [new stmt.ClassParam('a', null, null, null, false, false)],
        new stmt.ClassSuperclass('B', [
          new expr.Call(new expr.Identifier('a'), []),
        ]),
        [],
        [],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A implements B {}', () => {
    let source = 'class A implements B {}';
    let expected = [new stmt.Class('A', [], null, ['B'], [])];
    expect(ast(source)).toEqual(expected);
  });

  test('class A implements B, C, D, {}', () => {
    let source = 'class A implements B, C, D {}';
    let expected = [new stmt.Class('A', [], null, ['B', 'C', 'D'], [])];
    expect(ast(source)).toEqual(expected);
  });

  test('class A extends B implements C, D {}', () => {
    let source = 'class A extends B implements C, D {}';
    let expected = [
      new stmt.Class(
        'A',
        [],
        new stmt.ClassSuperclass('B', []),
        ['C', 'D'],
        [],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { init { echo "hello"; } }', () => {
    let source = 'class A { init { echo "hello"; } }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.ClassInitializer([
            new stmt.Echo(new expr.StringLiteral('hello')),
          ]),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { init { 1; } init { 2; } }', () => {
    let source = 'class A { init { 1; } init { 2; } }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.ClassInitializer([
            new stmt.Expression(new expr.NumberLiteral('1')),
          ]),
          new stmt.ClassInitializer([
            new stmt.Expression(new expr.NumberLiteral('2')),
          ]),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test.todo('final class A {}', () => {});
  test.todo('readonly class A {}', () => {});
});

describe('class methods', () => {
  test('class A { fun b() {} }', () => {
    let source = 'class A { fun b() {} }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [new stmt.ClassMethod(false, null, false, 'b', [], null, [])],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { fun b(c: number|string = 3,): true => true }', () => {
    let source = 'class A { fun b(c: number|string = 3,): true => true }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.ClassMethod(
            false,
            null,
            false,
            'b',
            [
              new stmt.Var(
                'c',
                new types.Union([new types.Number(), new types.String()]),
                new expr.NumberLiteral('3'),
              ),
            ],
            new types.True(),
            new expr.BooleanLiteral(true),
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { fun b() { return 3; } }', () => {
    let source = 'class A { fun b() { return 3; } }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.ClassMethod(false, null, false, 'b', [], null, [
            new stmt.Return(new expr.NumberLiteral('3')),
          ]),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { public fun b() {} }', () => {
    let source = 'class A { public fun b() {} }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [new stmt.ClassMethod(false, 'public', false, 'b', [], null, [])],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { static fun b() {} }', () => {
    let source = 'class A { static fun b() {} }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [new stmt.ClassMethod(false, null, true, 'b', [], null, [])],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { final fun b() {} }', () => {
    let source = 'class A { final fun b() {} }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [new stmt.ClassMethod(true, null, false, 'b', [], null, [])],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { final private static fun b() {} }', () => {
    let source = 'class A { final private static fun b() {} }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [new stmt.ClassMethod(true, 'private', true, 'b', [], null, [])],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});

describe('class constants', () => {
  test('class A { const b = 3; }', () => {
    let source = 'class A { const b = 3; }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.ClassConst(
            false,
            null,
            false,
            'b',
            null,
            new expr.NumberLiteral('3'),
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { protected const b: int|string = 4; }', () => {
    let source = 'class A { protected const b: int|string = 4; }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.ClassConst(
            false,
            'protected',
            false,
            'b',
            new types.Union([new types.Int(), new types.String()]),
            new expr.NumberLiteral('4'),
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { static const b = 4; }', () => {
    let source = 'class A { static const b = 4; }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.ClassConst(
            false,
            null,
            true,
            'b',
            null,
            new expr.NumberLiteral('4'),
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { final const b = 4; }', () => {
    let source = 'class A { final const b = 4; }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.ClassConst(
            true,
            null,
            false,
            'b',
            null,
            new expr.NumberLiteral('4'),
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { final private static const b = 4; }', () => {
    let source = 'class A { final private static const b = 4; }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.ClassConst(
            true,
            'private',
            true,
            'b',
            null,
            new expr.NumberLiteral('4'),
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});

describe('class properties', () => {
  test('class A { var b: number = 3; }', () => {
    let source = 'class A { var b: number = 3; }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.ClassProperty(
            false,
            null,
            false,
            new stmt.Var('b', new types.Number(), new expr.NumberLiteral('3')),
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { private var b; }', () => {
    let source = 'class A { private var b; }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.ClassProperty(
            false,
            'private',
            false,
            new stmt.Var('b', null, null),
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { static var b; }', () => {
    let source = 'class A { static var b; }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.ClassProperty(
            false,
            null,
            true,
            new stmt.Var('b', null, null),
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { final var b; }', () => {
    let source = 'class A { final var b; }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.ClassProperty(
            true,
            null,
            false,
            new stmt.Var('b', null, null),
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { final private static var b; }', () => {
    let source = 'class A { final private static var b; }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.ClassProperty(
            true,
            'private',
            true,
            new stmt.Var('b', null, null),
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test.todo('readonly properties somehow');
});

describe('abstract', () => {
  test('abstract class A {}', () => {
    let source = 'abstract class A {}';
    let expected = [new stmt.Class('A', [], null, [], [], true)];
    expect(ast(source)).toEqual(expected);
  });

  test('abstract class A { abstract fun b(): number; }', () => {
    let source = 'abstract class A { abstract fun b(): number; }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.AbstractClassMethod(
            null,
            false,
            'b',
            [],
            new types.Number(),
          ),
        ],
        true,
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});

describe('get expressions', () => {
  test('a.b', () => {
    let source = 'a.b';
    let expected = [
      new stmt.Expression(new expr.Get(new expr.Identifier('a'), 'b')),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('a?.b', () => {
    let source = 'a?.b';
    let expected = [
      new stmt.Expression(new expr.OptionalGet(new expr.Identifier('a'), 'b')),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('a.b.c', () => {
    let source = 'a.b.c';
    let expected = [
      new stmt.Expression(
        new expr.Get(new expr.Get(new expr.Identifier('a'), 'b'), 'c'),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('a.b?.c.d', () => {
    let source = 'a.b?.c.d';
    let expected = [
      new stmt.Expression(
        new expr.Get(
          new expr.OptionalGet(
            new expr.Get(new expr.Identifier('a'), 'b'),
            'c',
          ),
          'd',
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('a()?.b(1,2).c', () => {
    let source = 'a()?.b(1,2).c';
    let expected = [
      new stmt.Expression(
        new expr.Get(
          new expr.Call(
            new expr.OptionalGet(
              new expr.Call(new expr.Identifier('a'), []),
              'b',
            ),
            [new expr.NumberLiteral('1'), new expr.NumberLiteral('2')],
          ),
          'c',
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('this.hello', () => {
    let source = 'this.hello';
    let expected = [
      new stmt.Expression(new expr.Get(new expr.This(), 'hello')),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('super.hello', () => {
    let source = 'super.hello';
    let expected = [
      new stmt.Expression(new expr.Get(new expr.Super(), 'hello')),
    ];
    expect(ast(source)).toEqual(expected);
  });
});
