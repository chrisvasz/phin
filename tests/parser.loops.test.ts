// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../Scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';
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
