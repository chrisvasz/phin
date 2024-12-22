// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../Scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';

describe('echo statements', () => {
  test('echo "hello"', () => {
    let source = 'echo "hello"';
    let expected = [new stmt.Echo(new expr.StringLiteral('hello'))];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});

describe('blocks', () => {
  test('{ 1; 2; }', () => {
    let source = '{ 1; 2; }';
    let expected = [
      new stmt.Block([
        new stmt.Expression(new expr.NumberLiteral(1)),
        new stmt.Expression(new expr.NumberLiteral(2)),
      ]),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});
