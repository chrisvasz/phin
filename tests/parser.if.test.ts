// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../Scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';

describe('if statements', () => {
  test('if (true) 2', () => {
    let source = 'if (true) 2';
    let expected = [
      new stmt.If(
        new expr.BooleanLiteral(true),
        new stmt.Expression(new expr.NumberLiteral(2)),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('if (true) {2;"5";}', () => {
    let source = 'if (true) {2;"5";}';
    let expected = [
      new stmt.If(
        new expr.BooleanLiteral(true),
        new stmt.Block([
          new stmt.Expression(new expr.NumberLiteral(2)),
          new stmt.Expression(new expr.StringLiteral('5')),
        ]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('if (true) 2; else 3', () => {
    // TODO don't require that ;
    let source = 'if (true) 2; else 3';
    let expected = [
      new stmt.If(
        new expr.BooleanLiteral(true),
        new stmt.Expression(new expr.NumberLiteral(2)),
        new stmt.Expression(new expr.NumberLiteral(3)),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('if (true) 2; else {5;}', () => {
    let source = 'if (true) 2; else {5;}';
    let expected = [
      new stmt.If(
        new expr.BooleanLiteral(true),
        new stmt.Expression(new expr.NumberLiteral(2)),
        new stmt.Block([new stmt.Expression(new expr.NumberLiteral(5))]),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('if (true) 2; else if (false) 5;', () => {
    let source = 'if (true) 2; else if (false) 5;';
    let expected = [
      new stmt.If(
        new expr.BooleanLiteral(true),
        new stmt.Expression(new expr.NumberLiteral(2)),
        new stmt.If(
          new expr.BooleanLiteral(false),
          new stmt.Expression(new expr.NumberLiteral(5)),
          null,
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});
