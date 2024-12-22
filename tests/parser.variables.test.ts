// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../Scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';
import * as type from '../type';
import { Token, TokenType } from '../Token';

describe('variable declarations', () => {
  test('var x', () => {
    let source = 'var x';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        null,
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x = 3', () => {
    let source = 'var x = 3';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        null,
        new expr.NumberLiteral(3),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x = 3 + 1', () => {
    let source = 'var x = 3 + 1';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        null,
        new expr.Binary(
          new expr.NumberLiteral(3),
          new Token(TokenType.PLUS, '+', undefined, 1),
          new expr.NumberLiteral(1),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x = 3 + 1; var y; var z = "hello"', () => {
    let source = 'var x = 3 + 1; var y; var z = "hello"';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        null,
        new expr.Binary(
          new expr.NumberLiteral(3),
          new Token(TokenType.PLUS, '+', undefined, 1),
          new expr.NumberLiteral(1),
        ),
      ),
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'y', undefined, 1),
        null,
        null,
      ),
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'z', undefined, 1),
        null,
        new expr.StringLiteral('hello'),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: number', () => {
    let source = 'var x: number';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Number(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: number = 3', () => {
    let source = 'var x: number = 3';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Number(),
        new expr.NumberLiteral(3),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: string', () => {
    let source = 'var x: string';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.String(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: bool', () => {
    let source = 'var x: bool';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Boolean(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: null', () => {
    let source = 'var x: null';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Null(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: int', () => {
    let source = 'var x: int';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Int(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: float', () => {
    let source = 'var x: float';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Float(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: 5', () => {
    let source = 'var x: 5';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.NumberLiteral(5),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: "hello"', () => {
    let source = 'var x: "hello"';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.StringLiteral('hello'),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: Class', () => {
    let source = 'var x: Class';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Identifier('Class', []),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: true', () => {
    let source = 'var x: true';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.True(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: false', () => {
    let source = 'var x: false';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.False(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: array', () => {
    let source = 'var x: array';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Identifier('array', []),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: array<number>', () => {
    let source = 'var x: array<number>';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Identifier('array', [new type.Number()]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: array<array<array<number>>>', () => {
    let source = 'var x: array<array<array<number>>>';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Identifier('array', [
          new type.Identifier('array', [
            new type.Identifier('array', [new type.Number()]),
          ]),
        ]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: array<number|string>', () => {
    let source = 'var x: array<number|string>';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Identifier('array', [
          new type.Union([new type.Number(), new type.String()]),
        ]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: array<string,number>', () => {
    let source = 'var x: array<string,number>';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Identifier('array', [new type.String(), new type.Number()]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: array<string,>', () => {
    let source = 'var x: array<string,>';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Identifier('array', [new type.String()]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: array<string|number,number&null,?5>', () => {
    let source = 'var x: array<string|number,number&null,?5>';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Identifier('array', [
          new type.Union([new type.String(), new type.Number()]),
          new type.Intersection([new type.Number(), new type.Null()]),
          new type.Nullable(new type.NumberLiteral(5)),
        ]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: ?number', () => {
    let source = 'var x: ?number';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Nullable(new type.Number()),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: string|number', () => {
    let source = 'var x: string|number';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Union([new type.String(), new type.Number()]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: string|number|null', () => {
    let source = 'var x: string|number|null';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Union([new type.String(), new type.Number(), new type.Null()]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: string&number', () => {
    let source = 'var x: string&number';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Intersection([new type.String(), new type.Number()]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: string&number&null', () => {
    let source = 'var x: string&number&null';
    let expected = [
      new stmt.Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Intersection([
          new type.String(),
          new type.Number(),
          new type.Null(),
        ]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('abc = 123', () => {
    let source = 'abc = 123';
    let expected = [
      new stmt.Expression(
        new expr.Assign(
          new Token(TokenType.IDENTIFIER, 'abc', undefined, 1),
          new expr.NumberLiteral(123),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});
