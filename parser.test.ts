// @ts-ignore
import { expect, test } from 'bun:test';
import scan from './Scanner';
import parse from './parser';
import {
  Binary,
  ExpressionStatement,
  Grouping,
  NullLiteral,
  NumberLiteral,
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
