// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../Scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';

describe('literals', () => {
  test('null', () => {
    let source = 'null';
    let expected = [new stmt.Expression(new expr.NullLiteral())];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('true', () => {
    let source = 'true';
    let expected = [new stmt.Expression(new expr.BooleanLiteral(true))];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('false', () => {
    let source = 'false';
    let expected = [new stmt.Expression(new expr.BooleanLiteral(false))];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('123', () => {
    let source = '123';
    let expected = [new stmt.Expression(new expr.NumberLiteral(123))];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('"hello"', () => {
    let source = '"hello"';
    let expected = [new stmt.Expression(new expr.StringLiteral('hello'))];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});
