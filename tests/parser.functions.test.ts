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

describe('call expressions', () => {
  test('thing()', () => {
    let source = 'thing()';
    let expected = [
      new stmt.Expression(new expr.Call(new expr.Variable('thing'), [])),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('thing(1)', () => {
    let source = 'thing(1)';
    let expected = [
      new stmt.Expression(
        new expr.Call(new expr.Variable('thing'), [
          new expr.NumberLiteral('1'),
        ]),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('thing(1, 2)', () => {
    let source = 'thing(1, 2)';
    let expected = [
      new stmt.Expression(
        new expr.Call(new expr.Variable('thing'), [
          new expr.NumberLiteral('1'),
          new expr.NumberLiteral('2'),
        ]),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('thing(1 + 2, 3 - 4)', () => {
    let source = 'thing(1 + 2, 3 - 4)';
    let expected = [
      new stmt.Expression(
        new expr.Call(new expr.Variable('thing'), [
          new expr.Binary(
            new expr.NumberLiteral('1'),
            '+',
            new expr.NumberLiteral('2'),
          ),
          new expr.Binary(
            new expr.NumberLiteral('3'),
            '-',
            new expr.NumberLiteral('4'),
          ),
        ]),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('thing(thing2())', () => {
    let source = 'thing(thing2())';
    let expected = [
      new stmt.Expression(
        new expr.Call(new expr.Variable('thing'), [
          new expr.Call(new expr.Variable('thing2'), []),
        ]),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('thing(1,)', () => {
    let source = 'thing(1,)';
    let expected = [
      new stmt.Expression(
        new expr.Call(new expr.Variable('thing'), [
          new expr.NumberLiteral('1'),
        ]),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});

describe('function declarations', () => {
  test('fun foo() {}', () => {
    let source = 'fun foo() {}';
    let expected = [new stmt.Function('foo', [], null, [])];
    expect(ast(source)).toEqual(expected);
  });

  test('fun foo(a) {}', () => {
    let source = 'fun foo(a) {}';
    let expected = [
      new stmt.Function('foo', [new stmt.Var('a', null, null)], null, []),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('fun foo(a: array<number>, b: string,) {}', () => {
    let source = 'fun foo(a: array<number>, b: string,) {}';
    let expected = [
      new stmt.Function(
        'foo',
        [
          new stmt.Var(
            'a',
            new types.Identifier('array', [new types.Number()]),
            null,
          ),
          new stmt.Var('b', new types.String(), null),
        ],
        null,
        [],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('fun foo(): array<number> {}', () => {
    let source = 'fun foo(): array<number> {}';
    let expected = [
      new stmt.Function(
        'foo',
        [],
        new types.Identifier('array', [new types.Number()]),
        [],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('fun foo() {2;3;}', () => {
    let source = 'fun foo() {2;3;}';
    let expected = [
      new stmt.Function('foo', [], null, [
        new stmt.Expression(new expr.NumberLiteral('2')),
        new stmt.Expression(new expr.NumberLiteral('3')),
      ]),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('fun foo(a: number = 1) {}', () => {
    let source = 'fun foo(a: number = 1) {}';
    let expected = [
      new stmt.Function(
        'foo',
        [new stmt.Var('a', new types.Number(), new expr.NumberLiteral('1'))],
        null,
        [],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('fun foo() { 3; return 1; }', () => {
    let source = 'fun foo() { 3; return 1; }';
    let expected = [
      new stmt.Function('foo', [], null, [
        new stmt.Expression(new expr.NumberLiteral('3')),
        new stmt.Return(new expr.NumberLiteral('1')),
      ]),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('fun foo() { fun bar() {} }', () => {
    let source = 'fun foo() { fun bar() {} }';
    let expected = [
      new stmt.Function('foo', [], null, [
        new stmt.Function('bar', [], null, []),
      ]),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('fun foo() => thing();', () => {
    let source = 'fun foo() => thing();';
    let expected = [
      new stmt.Function(
        'foo',
        [],
        null,
        new expr.Call(new expr.Variable('thing'), []),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});

describe('function expressions', () => {
  test('var a = fun() {};', () => {
    let source = 'var a = fun() {};';
    let expected = [new stmt.Var('a', null, new expr.Function([], null, []))];
    expect(ast(source)).toEqual(expected);
  });

  test('var a = fun(): number => 1;', () => {
    let source = 'var a = fun(): number => 1;';
    let expected = [
      new stmt.Var(
        'a',
        null,
        new expr.Function([], new types.Number(), new expr.NumberLiteral('1')),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var a = fun(b: number|string = 4, c = 6,) { return 5; }', () => {
    let source = 'var a = fun(b: number|string = 4, c = 6) { return 5; }';
    let expected = [
      new stmt.Var(
        'a',
        null,
        new expr.Function(
          [
            new stmt.Var(
              'b',
              new types.Union([new types.Number(), new types.String()]),
              new expr.NumberLiteral('4'),
            ),
            new stmt.Var('c', null, new expr.NumberLiteral('6')),
          ],
          null,
          [new stmt.Return(new expr.NumberLiteral('5'))],
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var a = fun(b) => fun(c) => b + c;', () => {
    let source = 'var a = fun(b) => fun(c) => b + c;';
    let expected = [
      new stmt.Var(
        'a',
        null,
        new expr.Function(
          [new stmt.Var('b', null, null)],
          null,
          new expr.Function(
            [new stmt.Var('c', null, null)],
            null,
            new expr.Binary(
              new expr.Variable('b'),
              '+',
              new expr.Variable('c'),
            ),
          ),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});
