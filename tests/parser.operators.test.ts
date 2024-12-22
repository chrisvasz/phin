// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../Scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';
import { Token, TokenType } from '../Token';

describe('math', () => {
  test('1 + 2', () => {
    let source = '1 + 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.PLUS, '+', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 + 2 * 3', () => {
    let source = '1 + 2 * 3';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.PLUS, '+', undefined, 1),
          new expr.Binary(
            new expr.NumberLiteral(2),
            new Token(TokenType.STAR, '*', undefined, 1),
            new expr.NumberLiteral(3),
          ),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 * 2 - 3', () => {
    let source = '1 * 2 - 3';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.Binary(
            new expr.NumberLiteral(1),
            new Token(TokenType.STAR, '*', undefined, 1),
            new expr.NumberLiteral(2),
          ),
          new Token(TokenType.MINUS, '-', undefined, 1),
          new expr.NumberLiteral(3),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 + 2 + 3', () => {
    let source = '1 + 2 + 3';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.Binary(
            new expr.NumberLiteral(1),
            new Token(TokenType.PLUS, '+', undefined, 1),
            new expr.NumberLiteral(2),
          ),
          new Token(TokenType.PLUS, '+', undefined, 1),
          new expr.NumberLiteral(3),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 + (2 + 3)', () => {
    let source = '1 + (2 + 3)';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.PLUS, '+', undefined, 1),
          new expr.Grouping(
            new expr.Binary(
              new expr.NumberLiteral(2),
              new Token(TokenType.PLUS, '+', undefined, 1),
              new expr.NumberLiteral(3),
            ),
          ),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 / 2', () => {
    let source = '1 / 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.SLASH, '/', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});

describe('unary operators', () => {
  test('!true', () => {
    let source = '!true';
    let expected = [
      new stmt.Expression(
        new expr.Unary(
          new Token(TokenType.BANG, '!', undefined, 1),
          new expr.BooleanLiteral(true),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('-1', () => {
    let source = '-1';
    let expected = [
      new stmt.Expression(
        new expr.Unary(
          new Token(TokenType.MINUS, '-', undefined, 1),
          new expr.NumberLiteral(1),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('+1', () => {
    let source = '+1';
    let expected = [
      new stmt.Expression(
        new expr.Unary(
          new Token(TokenType.PLUS, '+', undefined, 1),
          new expr.NumberLiteral(1),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('!!true', () => {
    let source = '!!true';
    let expected = [
      new stmt.Expression(
        new expr.Unary(
          new Token(TokenType.BANG, '!', undefined, 1),
          new expr.Unary(
            new Token(TokenType.BANG, '!', undefined, 1),
            new expr.BooleanLiteral(true),
          ),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('++i', () => {
    let source = '++i';
    let expected = [
      new stmt.Expression(
        new expr.Unary(
          new Token(TokenType.PLUS_PLUS, '++', undefined, 1),
          new expr.Variable(new Token(TokenType.IDENTIFIER, 'i', undefined, 1)),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('--i', () => {
    let source = '--i';
    let expected = [
      new stmt.Expression(
        new expr.Unary(
          new Token(TokenType.MINUS_MINUS, '--', undefined, 1),
          new expr.Variable(new Token(TokenType.IDENTIFIER, 'i', undefined, 1)),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test.todo('i++');
  test.todo('i--');
  test.todo('++1'); // should fail
  test.todo('1++'); // should fail
});

describe('binary operators', () => {
  test('1 > 2', () => {
    let source = '1 > 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.GREATER, '>', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 >= 2', () => {
    let source = '1 >= 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.GREATER_EQUAL, '>=', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 < 2', () => {
    let source = '1 < 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.LESS, '<', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 <= 2', () => {
    let source = '1 <= 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.LESS_EQUAL, '<=', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 == 2', () => {
    let source = '1 == 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.EQUAL_EQUAL, '==', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 === 2', () => {
    let source = '1 === 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.EQUAL_EQUAL_EQUAL, '===', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 != 2', () => {
    let source = '1 != 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.BANG_EQUAL, '!=', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 !== 2', () => {
    let source = '1 !== 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.BANG_EQUAL_EQUAL, '!==', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 <=> 2', () => {
    let source = '1 <=> 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.SPACESHIP, '<=>', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 && 2', () => {
    let source = '1 && 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.LOGICAL_AND, '&&', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 || 2', () => {
    let source = '1 || 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.LOGICAL_OR, '||', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});

describe('terminators', () => {
  test('1;2', () => {
    let source = '1;2';
    let expected = [
      new stmt.Expression(new expr.NumberLiteral(1)),
      new stmt.Expression(new expr.NumberLiteral(2)),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test(`1\n2`, () => {
    let source = `1\n2`;
    let expected = [
      new stmt.Expression(new expr.NumberLiteral(1)),
      new stmt.Expression(new expr.NumberLiteral(2)),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});
