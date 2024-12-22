// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../Scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';
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
