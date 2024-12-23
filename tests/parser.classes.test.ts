// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../Scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';
import * as types from '../type';
import { Token, TokenType } from '../Token';

function ast(source: string) {
  return parse(scan(source));
}

describe('class declarations', () => {
  test('class A {}', () => {
    let source = 'class A {}';
    let expected = [new stmt.Class('A', [], null, [], [])];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { fun b() {} }', () => {
    let source = 'class A { fun b() {} }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.Function(
            new Token(TokenType.IDENTIFIER, 'b', undefined, 1),
            [],
            null,
            [],
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
          new stmt.Function(
            new Token(TokenType.IDENTIFIER, 'b', undefined, 1),
            [
              new stmt.Var(
                new Token(TokenType.IDENTIFIER, 'c', undefined, 1),
                new types.Union([new types.Number(), new types.String()]),
                new expr.NumberLiteral(3),
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
          new stmt.Function(
            new Token(TokenType.IDENTIFIER, 'b', undefined, 1),
            [],
            null,
            [new stmt.Return(new expr.NumberLiteral(3))],
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { var b: number = 3; }', () => {
    let source = 'class A { var b: number = 3; }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.Var(
            new Token(TokenType.IDENTIFIER, 'b', undefined, 1),
            new types.Number(),
            new expr.NumberLiteral(3),
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A { var b; fun c() {} }', () => {
    let source = 'class A { var b; fun c() {} }';
    let expected = [
      new stmt.Class(
        'A',
        [],
        null,
        [],
        [
          new stmt.Var(
            new Token(TokenType.IDENTIFIER, 'b', undefined, 1),
            null,
            null,
          ),
          new stmt.Function(
            new Token(TokenType.IDENTIFIER, 'c', undefined, 1),
            [],
            null,
            [],
          ),
        ],
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('class A(b) {}', () => {
    let source = 'class A(b) {}';
    let expected = [
      new stmt.Class(
        'A',
        [
          new stmt.Var(
            new Token(TokenType.IDENTIFIER, 'b', undefined, 1),
            null,
            null,
          ),
        ],
        null,
        [],
        [],
      ),
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
            new Token(TokenType.IDENTIFIER, 'b', undefined, 1),
            new types.Union([new types.Number(), new types.String()]),
            new expr.NumberLiteral(5),
          ),
          new stmt.Var(
            new Token(TokenType.IDENTIFIER, 'c', undefined, 1),
            new types.Boolean(),
            null,
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
            new stmt.Var(
              new Token(TokenType.IDENTIFIER, 'b', undefined, 1),
              null,
              new expr.NumberLiteral(3),
            ),
          ),
        ],
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
});
