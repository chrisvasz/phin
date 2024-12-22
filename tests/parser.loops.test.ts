// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../Scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';
import * as types from '../type';
import { Token, TokenType } from '../Token';

describe('while', () => {
  test('while (true) 2', () => {
    let source = 'while (true) 2';
    let expected = [
      new stmt.While(
        new expr.BooleanLiteral(true),
        new stmt.Expression(new expr.NumberLiteral(2)),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('while (1 < 2) 2', () => {
    let source = 'while (1 < 2) 2';
    let expected = [
      new stmt.While(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.LESS, '<', undefined, 1),
          new expr.NumberLiteral(2),
        ),
        new stmt.Expression(new expr.NumberLiteral(2)),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('while (null) {2;}', () => {
    let source = 'while (null) {2;}';
    let expected = [
      new stmt.While(
        new expr.NullLiteral(),
        new stmt.Block([new stmt.Expression(new expr.NumberLiteral(2))]),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});

describe('for', () => {
  test('for (;;) 2', () => {
    let source = 'for (;;) 2';
    let expected = [
      new stmt.For(
        null,
        null,
        null,
        new stmt.Expression(new expr.NumberLiteral(2)),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('for (var i = 0; ;) 2', () => {
    let source = 'for (var i = 0; ;) 2';
    let expected = [
      new stmt.For(
        new stmt.Var(
          new Token(TokenType.IDENTIFIER, 'i', undefined, 1),
          null,
          new expr.NumberLiteral(0),
        ),
        null,
        null,
        new stmt.Expression(new expr.NumberLiteral(2)),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('for (var i = 0; i < 10;) 2', () => {
    let source = 'for (var i = 0; i < 10;) 2';
    let expected = [
      new stmt.For(
        new stmt.Var(
          new Token(TokenType.IDENTIFIER, 'i', undefined, 1),
          null,
          new expr.NumberLiteral(0),
        ),
        new expr.Binary(
          new expr.Variable(new Token(TokenType.IDENTIFIER, 'i', undefined, 1)),
          new Token(TokenType.LESS, '<', undefined, 1),
          new expr.NumberLiteral(10),
        ),
        null,
        new stmt.Expression(new expr.NumberLiteral(2)),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test.todo('for (var i: number = 0; i < 10; i = i + 1) {2;}');
});
