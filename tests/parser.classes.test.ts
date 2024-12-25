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

describe('new expressions', () => {
  test('new a', () => {
    let source = 'new a';
    let expected = [new stmt.Expression(new expr.New(new expr.Variable('a')))];
    expect(ast(source)).toEqual(expected);
  });

  test('new A()', () => {
    let source = 'new A()';
    let expected = [
      new stmt.Expression(
        new expr.New(new expr.Call(new expr.Variable('A'), [])),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});

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
          new expr.Call(new expr.Variable('a'), []),
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

  test.todo('abstract class A { fun abstractMethod(); }'); // borrowed from dart
  test.todo('final class A {}', () => {});
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
        [
          new stmt.ClassMethod(
            new stmt.Function('b', [], null, []),
            null,
            false,
            false,
          ),
        ],
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
            new stmt.Function(
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
            null,
            false,
            false,
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
          new stmt.ClassMethod(
            new stmt.Function('b', [], null, [
              new stmt.Return(new expr.NumberLiteral('3')),
            ]),
            null,
            false,
            false,
          ),
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
        [
          new stmt.ClassMethod(
            new stmt.Function('b', [], null, []),
            'public',
            false,
            false,
          ),
        ],
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
        [
          new stmt.ClassMethod(
            new stmt.Function('b', [], null, []),
            null,
            true,
            false,
          ),
        ],
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
        [
          new stmt.ClassMethod(
            new stmt.Function('b', [], null, []),
            null,
            false,
            true,
          ),
        ],
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
        [
          new stmt.ClassMethod(
            new stmt.Function('b', [], null, []),
            'private',
            true,
            true,
          ),
        ],
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
            'b',
            null,
            new expr.NumberLiteral('3'),
            null,
            false,
            false,
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
            'b',
            new types.Union([new types.Int(), new types.String()]),
            new expr.NumberLiteral('4'),
            'protected',
            false,
            false,
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
            'b',
            null,
            new expr.NumberLiteral('4'),
            null,
            true,
            false,
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
            'b',
            null,
            new expr.NumberLiteral('4'),
            null,
            false,
            true,
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
            'b',
            null,
            new expr.NumberLiteral('4'),
            'private',
            true,
            true,
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
            new stmt.Var('b', new types.Number(), new expr.NumberLiteral('3')),
            null,
            false,
            false,
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
            new stmt.Var('b', null, null),
            'private',
            false,
            false,
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
            new stmt.Var('b', null, null),
            null,
            true,
            false,
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
            new stmt.Var('b', null, null),
            null,
            false,
            true,
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
            new stmt.Var('b', null, null),
            'private',
            true,
            true,
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});

describe('kitchen sink', () => {
  test('kitchen sink', () => {
    let source = `
      class A (
        a,
        private b: string,
        readonly c: array<number> = [3],
        final public d,
      ) extends B(
        c,
        d(),
      ) implements C, D {
        private const b: int = 3;
        protected var c: string = "hello";
        public static fun d(e: bool): number => 3;
        fun f() {
          echo "hello";
        }
        init {
          echo "world";
        }
      }
    `.trim();
    let expected = [
      new stmt.Class(
        'A',
        [
          new stmt.ClassParam('a', null, null, null, false, false),
          new stmt.ClassParam(
            'b',
            new types.String(),
            null,
            'private',
            false,
            false,
          ),
          new stmt.ClassParam(
            'c',
            new types.Identifier('array', [new types.Number()]),
            new expr.ArrayLiteral([
              new expr.ArrayElement(null, new expr.NumberLiteral('3')),
            ]),
            null,
            false,
            true,
          ),
          new stmt.ClassParam('d', null, null, 'public', true, false),
        ],
        new stmt.ClassSuperclass('B', [
          new expr.Variable('c'),
          new expr.Call(new expr.Variable('d'), []),
        ]),
        ['C', 'D'],
        [
          new stmt.ClassConst(
            'b',
            new types.Int(),
            new expr.NumberLiteral('3'),
            'private',
            false,
            false,
          ),
          new stmt.ClassProperty(
            new stmt.Var(
              'c',
              new types.String(),
              new expr.StringLiteral('hello'),
            ),
            'protected',
            false,
            false,
          ),
          new stmt.ClassMethod(
            new stmt.Function(
              'd',
              [new stmt.Var('e', new types.Boolean(), null)],
              new types.Number(),
              new expr.NumberLiteral('3'),
            ),
            'public',
            true,
            false,
          ),
          new stmt.ClassMethod(
            new stmt.Function('f', [], null, [
              new stmt.Echo(new expr.StringLiteral('hello')),
            ]),
            null,
            false,
            false,
          ),
          new stmt.ClassInitializer([
            new stmt.Echo(new expr.StringLiteral('world')),
          ]),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});

describe('get expressions', () => {
  test('a.b', () => {
    let source = 'a.b';
    let expected = [
      new stmt.Expression(new expr.Get(new expr.Variable('a'), 'b')),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('a?.b', () => {
    let source = 'a?.b';
    let expected = [
      new stmt.Expression(new expr.OptionalGet(new expr.Variable('a'), 'b')),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('a.b.c', () => {
    let source = 'a.b.c';
    let expected = [
      new stmt.Expression(
        new expr.Get(new expr.Get(new expr.Variable('a'), 'b'), 'c'),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('a.b?.c.d', () => {
    let source = 'a.b?.c.d';
    let expected = [
      new stmt.Expression(
        new expr.Get(
          new expr.OptionalGet(new expr.Get(new expr.Variable('a'), 'b'), 'c'),
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
              new expr.Call(new expr.Variable('a'), []),
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
