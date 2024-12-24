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
      new stmt.Class('A', [new stmt.Var('b', null, null)], null, [], []),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A(b: number|string = 5, c: bool,) {}', () => {
    let source = 'class A(b: number|string = 5, c: bool,) {}';
    let expected = [
      new stmt.Class(
        'A',
        [
          new stmt.Var(
            'b',
            new types.Union([new types.Number(), new types.String()]),
            new expr.NumberLiteral(5),
          ),
          new stmt.Var('c', new types.Boolean(), null),
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
    let expected = [new stmt.Class('A', [], 'B', [], [])];
    expect(ast(source)).toEqual(expected);
  });

  test.todo('class A(a) extends B(a) {}');

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
    let expected = [new stmt.Class('A', [], 'B', ['C', 'D'], [])];
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
            new stmt.Expression(new expr.NumberLiteral(1)),
          ]),
          new stmt.ClassInitializer([
            new stmt.Expression(new expr.NumberLiteral(2)),
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
                  new expr.NumberLiteral(3),
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
              new stmt.Return(new expr.NumberLiteral(3)),
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
            new stmt.Var('b', null, new expr.NumberLiteral(3)),
            null,
            false,
            false,
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { protected const b = 4; }', () => {
    let source = 'class A { protected const b = 4; }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.ClassConst(
            new stmt.Var('b', null, new expr.NumberLiteral(4)),
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
            new stmt.Var('b', null, new expr.NumberLiteral(4)),
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
            new stmt.Var('b', null, new expr.NumberLiteral(4)),
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
            new stmt.Var('b', null, new expr.NumberLiteral(4)),
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
            new stmt.Var('b', new types.Number(), new expr.NumberLiteral(3)),
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
