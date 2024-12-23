// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../Scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';
import * as types from '../type';
import { Token, TokenType } from '../Token';

describe('call expressions', () => {
  test('thing()', () => {
    let source = 'thing()';
    let expected = [
      new stmt.Expression(
        new expr.Call(
          new expr.Variable(
            new Token(TokenType.IDENTIFIER, 'thing', undefined, 1),
          ),
          [],
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('thing(1)', () => {
    let source = 'thing(1)';
    let expected = [
      new stmt.Expression(
        new expr.Call(
          new expr.Variable(
            new Token(TokenType.IDENTIFIER, 'thing', undefined, 1),
          ),
          [new expr.NumberLiteral(1)],
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('thing(1, 2)', () => {
    let source = 'thing(1, 2)';
    let expected = [
      new stmt.Expression(
        new expr.Call(
          new expr.Variable(
            new Token(TokenType.IDENTIFIER, 'thing', undefined, 1),
          ),
          [new expr.NumberLiteral(1), new expr.NumberLiteral(2)],
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('thing(1 + 2, 3 - 4)', () => {
    let source = 'thing(1 + 2, 3 - 4)';
    let expected = [
      new stmt.Expression(
        new expr.Call(
          new expr.Variable(
            new Token(TokenType.IDENTIFIER, 'thing', undefined, 1),
          ),
          [
            new expr.Binary(
              new expr.NumberLiteral(1),
              new Token(TokenType.PLUS, '+', undefined, 1),
              new expr.NumberLiteral(2),
            ),
            new expr.Binary(
              new expr.NumberLiteral(3),
              new Token(TokenType.MINUS, '-', undefined, 1),
              new expr.NumberLiteral(4),
            ),
          ],
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('thing(thing2())', () => {
    let source = 'thing(thing2())';
    let expected = [
      new stmt.Expression(
        new expr.Call(
          new expr.Variable(
            new Token(TokenType.IDENTIFIER, 'thing', undefined, 1),
          ),
          [
            new expr.Call(
              new expr.Variable(
                new Token(TokenType.IDENTIFIER, 'thing2', undefined, 1),
              ),
              [],
            ),
          ],
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('thing(1,)', () => {
    let source = 'thing(1,)';
    let expected = [
      new stmt.Expression(
        new expr.Call(
          new expr.Variable(
            new Token(TokenType.IDENTIFIER, 'thing', undefined, 1),
          ),
          [new expr.NumberLiteral(1)],
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});

describe('function declarations', () => {
  test('fun foo() {}', () => {
    let source = 'fun foo() {}';
    let expected = [
      new stmt.Function(
        new Token(TokenType.IDENTIFIER, 'foo', undefined, 1),
        [],
        null,
        [],
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('fun foo(a) {}', () => {
    let source = 'fun foo(a) {}';
    let expected = [
      new stmt.Function(
        new Token(TokenType.IDENTIFIER, 'foo', undefined, 1),
        [
          new stmt.Var(
            new Token(TokenType.IDENTIFIER, 'a', undefined, 1),
            null,
            null,
          ),
        ],
        null,
        [],
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('fun foo(a: array<number>, b: string,) {}', () => {
    let source = 'fun foo(a: array<number>, b: string,) {}';
    let expected = [
      new stmt.Function(
        new Token(TokenType.IDENTIFIER, 'foo', undefined, 1),
        [
          new stmt.Var(
            new Token(TokenType.IDENTIFIER, 'a', undefined, 1),
            new types.Identifier('array', [new types.Number()]),
            null,
          ),
          new stmt.Var(
            new Token(TokenType.IDENTIFIER, 'b', undefined, 1),
            new types.String(),
            null,
          ),
        ],
        null,
        [],
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('fun foo(): array<number> {}', () => {
    let source = 'fun foo(): array<number> {}';
    let expected = [
      new stmt.Function(
        new Token(TokenType.IDENTIFIER, 'foo', undefined, 1),
        [],
        new types.Identifier('array', [new types.Number()]),
        [],
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('fun foo() {2;3;}', () => {
    let source = 'fun foo() {2;3;}';
    let expected = [
      new stmt.Function(
        new Token(TokenType.IDENTIFIER, 'foo', undefined, 1),
        [],
        null,
        [
          new stmt.Expression(new expr.NumberLiteral(2)),
          new stmt.Expression(new expr.NumberLiteral(3)),
        ],
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('fun foo(a: number = 1) {}', () => {
    let source = 'fun foo(a: number = 1) {}';
    let expected = [
      new stmt.Function(
        new Token(TokenType.IDENTIFIER, 'foo', undefined, 1),
        [
          new stmt.Var(
            new Token(TokenType.IDENTIFIER, 'a', undefined, 1),
            new types.Number(),
            new expr.NumberLiteral(1),
          ),
        ],
        null,
        [],
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('fun foo() { 3; return 1; }', () => {
    let source = 'fun foo() { 3; return 1; }';
    let expected = [
      new stmt.Function(
        new Token(TokenType.IDENTIFIER, 'foo', undefined, 1),
        [],
        null,
        [
          new stmt.Expression(new expr.NumberLiteral(3)),
          new stmt.Return(new expr.NumberLiteral(1)),
        ],
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('fun foo() { fun bar() {} }', () => {
    let source = 'fun foo() { fun bar() {} }';
    let expected = [
      new stmt.Function(
        new Token(TokenType.IDENTIFIER, 'foo', undefined, 1),
        [],
        null,
        [
          new stmt.Function(
            new Token(TokenType.IDENTIFIER, 'bar', undefined, 1),
            [],
            null,
            [],
          ),
        ],
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('fun foo() => thing();', () => {
    let source = 'fun foo() => thing();';
    let expected = [
      new stmt.Function(
        new Token(TokenType.IDENTIFIER, 'foo', undefined, 1),
        [],
        null,
        new expr.Call(
          new expr.Variable(
            new Token(TokenType.IDENTIFIER, 'thing', undefined, 1),
          ),
          [],
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});

describe('function expressions', () => {
  test('var a = fun() {};', () => {
    let source = 'var a = fun() {};';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'a', undefined, 1),
        null,
        new expr.Function(null, [], null, []),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var a = fun(): number => 1;', () => {
    let source = 'var a = fun(): number => 1;';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'a', undefined, 1),
        null,
        new expr.Function(
          null,
          [],
          new types.Number(),
          new expr.NumberLiteral(1),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var a = fun(b: number|string = 4, c = 6,) { return 5; }', () => {
    let source = 'var a = fun(b: number|string = 4, c = 6) { return 5; }';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'a', undefined, 1),
        null,
        new expr.Function(
          null,
          [
            new stmt.Var(
              new Token(TokenType.IDENTIFIER, 'b', undefined, 1),
              new types.Union([new types.Number(), new types.String()]),
              new expr.NumberLiteral(4),
            ),
            new stmt.Var(
              new Token(TokenType.IDENTIFIER, 'c', undefined, 1),
              null,
              new expr.NumberLiteral(6),
            ),
          ],
          null,
          [new stmt.Return(new expr.NumberLiteral(5))],
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var a = fun(b) => fun(c) => b + c;', () => {
    let source = 'var a = fun(b) => fun(c) => b + c;';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'a', undefined, 1),
        null,
        new expr.Function(
          null,
          [
            new stmt.Var(
              new Token(TokenType.IDENTIFIER, 'b', undefined, 1),
              null,
              null,
            ),
          ],
          null,
          new expr.Function(
            null,
            [
              new stmt.Var(
                new Token(TokenType.IDENTIFIER, 'c', undefined, 1),
                null,
                null,
              ),
            ],
            null,
            new expr.Binary(
              new expr.Variable(
                new Token(TokenType.IDENTIFIER, 'b', undefined, 1),
              ),
              new Token(TokenType.PLUS, '+', undefined, 1),
              new expr.Variable(
                new Token(TokenType.IDENTIFIER, 'c', undefined, 1),
              ),
            ),
          ),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});
