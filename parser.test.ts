// @ts-ignore
import { expect, test } from 'bun:test';
import scan from './Scanner';
import parse from './parser';
import {
  Assign,
  Binary,
  Block,
  EchoStatement,
  ExpressionStatement,
  Grouping,
  NullLiteral,
  NumberLiteral,
  StringLiteral,
  VarStatement,
} from './nodes';
import { Token, TokenType } from './Token';

test('null', () => {
  let source = 'null';
  let expected = [new ExpressionStatement(new NullLiteral())];
  let tokens = scan(source);
  let ast = parse(tokens);
  expect(ast).toEqual(expected);
});

test('123', () => {
  let source = '123';
  let expected = [new ExpressionStatement(new NumberLiteral(123))];
  let tokens = scan(source);
  let ast = parse(tokens);
  expect(ast).toEqual(expected);
});

test('1 + 2', () => {
  let source = '1 + 2';
  let expected = [
    new ExpressionStatement(
      new Binary(
        new NumberLiteral(1),
        new Token(TokenType.PLUS, '+', undefined, 1),
        new NumberLiteral(2),
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
    new ExpressionStatement(
      new Binary(
        new NumberLiteral(1),
        new Token(TokenType.PLUS, '+', undefined, 1),
        new Binary(
          new NumberLiteral(2),
          new Token(TokenType.STAR, '*', undefined, 1),
          new NumberLiteral(3),
        ),
      ),
    ),
  ];
  let tokens = scan(source);
  let ast = parse(tokens);
  expect(ast).toEqual(expected);
});

test('1 * 2 + 3', () => {
  let source = '1 * 2 + 3';
  let expected = [
    new ExpressionStatement(
      new Binary(
        new Binary(
          new NumberLiteral(1),
          new Token(TokenType.STAR, '*', undefined, 1),
          new NumberLiteral(2),
        ),
        new Token(TokenType.PLUS, '+', undefined, 1),
        new NumberLiteral(3),
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
    new ExpressionStatement(
      new Binary(
        new Binary(
          new NumberLiteral(1),
          new Token(TokenType.PLUS, '+', undefined, 1),
          new NumberLiteral(2),
        ),
        new Token(TokenType.PLUS, '+', undefined, 1),
        new NumberLiteral(3),
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
    new ExpressionStatement(
      new Binary(
        new NumberLiteral(1),
        new Token(TokenType.PLUS, '+', undefined, 1),
        new Grouping(
          new Binary(
            new NumberLiteral(2),
            new Token(TokenType.PLUS, '+', undefined, 1),
            new NumberLiteral(3),
          ),
        ),
      ),
    ),
  ];
  let tokens = scan(source);
  let ast = parse(tokens);
  expect(ast).toEqual(expected);
});

test('1;2', () => {
  let source = '1;2';
  let expected = [
    new ExpressionStatement(new NumberLiteral(1)),
    new ExpressionStatement(new NumberLiteral(2)),
  ];
  let tokens = scan(source);
  let ast = parse(tokens);
  expect(ast).toEqual(expected);
});

test(`1\n2`, () => {
  let source = `1\n2`;
  let expected = [
    new ExpressionStatement(new NumberLiteral(1)),
    new ExpressionStatement(new NumberLiteral(2)),
  ];
  let tokens = scan(source);
  let ast = parse(tokens);
  expect(ast).toEqual(expected);
});

test('1 > 2', () => {
  let source = '1 > 2';
  let expected = [
    new ExpressionStatement(
      new Binary(
        new NumberLiteral(1),
        new Token(TokenType.GREATER, '>', undefined, 1),
        new NumberLiteral(2),
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
    new ExpressionStatement(
      new Binary(
        new NumberLiteral(1),
        new Token(TokenType.GREATER_EQUAL, '>=', undefined, 1),
        new NumberLiteral(2),
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
    new ExpressionStatement(
      new Binary(
        new NumberLiteral(1),
        new Token(TokenType.LESS, '<', undefined, 1),
        new NumberLiteral(2),
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
    new ExpressionStatement(
      new Binary(
        new NumberLiteral(1),
        new Token(TokenType.LESS_EQUAL, '<=', undefined, 1),
        new NumberLiteral(2),
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
    new ExpressionStatement(
      new Binary(
        new NumberLiteral(1),
        new Token(TokenType.EQUAL_EQUAL, '==', undefined, 1),
        new NumberLiteral(2),
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
    new ExpressionStatement(
      new Binary(
        new NumberLiteral(1),
        new Token(TokenType.BANG_EQUAL, '!=', undefined, 1),
        new NumberLiteral(2),
      ),
    ),
  ];
  let tokens = scan(source);
  let ast = parse(tokens);
  expect(ast).toEqual(expected);
});

test('"hello"', () => {
  let source = '"hello"';
  let expected = [new ExpressionStatement(new StringLiteral('hello'))];
  let tokens = scan(source);
  let ast = parse(tokens);
  expect(ast).toEqual(expected);
});

test('echo "hello"', () => {
  let source = 'echo "hello"';
  let expected = [new EchoStatement(new StringLiteral('hello'))];
  let tokens = scan(source);
  let ast = parse(tokens);
  expect(ast).toEqual(expected);
});

test('var x', () => {
  let source = 'var x';
  let expected = [
    new VarStatement(new Token(TokenType.IDENTIFIER, 'x', undefined, 1), null),
  ];
  let tokens = scan(source);
  let ast = parse(tokens);
  expect(ast).toEqual(expected);
});

test('var x = 3', () => {
  let source = 'var x = 3';
  let expected = [
    new VarStatement(
      new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
      new NumberLiteral(3),
    ),
  ];
  let tokens = scan(source);
  let ast = parse(tokens);
  expect(ast).toEqual(expected);
});

test('var x = 3 + 1', () => {
  let source = 'var x = 3 + 1';
  let expected = [
    new VarStatement(
      new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
      new Binary(
        new NumberLiteral(3),
        new Token(TokenType.PLUS, '+', undefined, 1),
        new NumberLiteral(1),
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
    new VarStatement(
      new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
      new Binary(
        new NumberLiteral(3),
        new Token(TokenType.PLUS, '+', undefined, 1),
        new NumberLiteral(1),
      ),
    ),
    new VarStatement(new Token(TokenType.IDENTIFIER, 'y', undefined, 1), null),
    new VarStatement(
      new Token(TokenType.IDENTIFIER, 'z', undefined, 1),
      new StringLiteral('hello'),
    ),
  ];
  let tokens = scan(source);
  let ast = parse(tokens);
  expect(ast).toEqual(expected);
});

test('abc = 123', () => {
  let source = 'abc = 123';
  let expected = [
    new ExpressionStatement(
      new Assign(
        new Token(TokenType.IDENTIFIER, 'abc', undefined, 1),
        new NumberLiteral(123),
      ),
    ),
  ];
  let tokens = scan(source);
  let ast = parse(tokens);
  expect(ast).toEqual(expected);
});

test('{ 1; 2; }', () => {
  let source = '{ 1; 2; }';
  let expected = [
    new Block([
      new ExpressionStatement(new NumberLiteral(1)),
      new ExpressionStatement(new NumberLiteral(2)),
    ]),
  ];
  let tokens = scan(source);
  let ast = parse(tokens);
  expect(ast).toEqual(expected);
});
