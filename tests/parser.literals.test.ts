// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';

function ast(source: string) {
  return parse(scan(source));
}

describe('literals', () => {
  test('null', () => {
    let source = 'null';
    let expected = [new stmt.Expression(new expr.NullLiteral())];
    expect(ast(source)).toEqual(expected);
  });

  test('true', () => {
    let source = 'true';
    let expected = [new stmt.Expression(new expr.BooleanLiteral(true))];
    expect(ast(source)).toEqual(expected);
  });

  test('false', () => {
    let source = 'false';
    let expected = [new stmt.Expression(new expr.BooleanLiteral(false))];
    expect(ast(source)).toEqual(expected);
  });

  test('123', () => {
    let source = '123';
    let expected = [new stmt.Expression(new expr.NumberLiteral(123))];
    expect(ast(source)).toEqual(expected);
  });

  test('"hello"', () => {
    let source = '"hello"';
    let expected = [new stmt.Expression(new expr.StringLiteral('hello'))];
    expect(ast(source)).toEqual(expected);
  });
});
