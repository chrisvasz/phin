// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';

function ast(source: string) {
  return parse(scan(source));
}

describe('echo statements', () => {
  test('echo "hello"', () => {
    let source = 'echo "hello"';
    let expected = [new stmt.Echo(new expr.StringLiteral('hello'))];
    expect(ast(source)).toEqual(expected);
  });
});

describe('blocks', () => {
  test(';;;', () => {
    let source = ';;;';
    let expected = [];
    expect(ast(source)).toEqual(expected);
  });

  test('{ 1; 2; }', () => {
    let source = '{ 1; 2; }';
    let expected = [
      new stmt.Block([
        new stmt.Expression(new expr.NumberLiteral(1)),
        new stmt.Expression(new expr.NumberLiteral(2)),
      ]),
    ];
    expect(ast(source)).toEqual(expected);
  });
});
