// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../Scanner';
import parse from '../parser';
import { Block, Echo, Expression, If, Var } from '../stmt';
import * as expr from '../expr';
import * as type from '../type';
import { Token, TokenType } from '../Token';

describe('echo statements', () => {
  test('echo "hello"', () => {
    let source = 'echo "hello"';
    let expected = [new Echo(new expr.StringLiteral('hello'))];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});

describe('blocks', () => {
  test('{ 1; 2; }', () => {
    let source = '{ 1; 2; }';
    let expected = [
      new Block([
        new Expression(new expr.NumberLiteral(1)),
        new Expression(new expr.NumberLiteral(2)),
      ]),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});
