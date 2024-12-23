// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';
import * as types from '../type';

function ast(source: string) {
  return parse(scan(source));
}

describe('while', () => {
  test('while (true) 2', () => {
    let source = 'while (true) 2';
    let expected = [
      new stmt.While(
        new expr.BooleanLiteral(true),
        new stmt.Expression(new expr.NumberLiteral(2)),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('while (1 < 2) 2', () => {
    let source = 'while (1 < 2) 2';
    let expected = [
      new stmt.While(
        new expr.Binary(
          new expr.NumberLiteral(1),
          '<',
          new expr.NumberLiteral(2),
        ),
        new stmt.Expression(new expr.NumberLiteral(2)),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('while (null) {2;}', () => {
    let source = 'while (null) {2;}';
    let expected = [
      new stmt.While(
        new expr.NullLiteral(),
        new stmt.Block([new stmt.Expression(new expr.NumberLiteral(2))]),
      ),
    ];
    expect(ast(source)).toEqual(expected);
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
    expect(ast(source)).toEqual(expected);
  });

  test('for (var i = 0; ;) 2', () => {
    let source = 'for (var i = 0; ;) 2';
    let expected = [
      new stmt.For(
        new stmt.Var('i', null, new expr.NumberLiteral(0)),
        null,
        null,
        new stmt.Expression(new expr.NumberLiteral(2)),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('for (var i = 0; i < 10;) 2', () => {
    let source = 'for (var i = 0; i < 10;) 2';
    let expected = [
      new stmt.For(
        new stmt.Var('i', null, new expr.NumberLiteral(0)),
        new expr.Binary(
          new expr.Variable('i'),
          '<',
          new expr.NumberLiteral(10),
        ),
        null,
        new stmt.Expression(new expr.NumberLiteral(2)),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('for (var i: number = 0; i < 10; ++i) {2;}', () => {
    let source = 'for (var i: number = 0; i < 10; ++i) {2;}';
    let expected = [
      new stmt.For(
        new stmt.Var('i', new types.Number(), new expr.NumberLiteral(0)),
        new expr.Binary(
          new expr.Variable('i'),
          '<',
          new expr.NumberLiteral(10),
        ),
        new expr.Unary('++', new expr.Variable('i')),
        new stmt.Block([new stmt.Expression(new expr.NumberLiteral(2))]),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});

describe('foreach', () => {
  test('foreach (list as i) 2', () => {
    let source = 'foreach (list as i) 2';
    let expected = [
      new stmt.Foreach(
        null,
        new stmt.Var('i', null, null),
        new expr.Variable('list'),
        new stmt.Expression(new expr.NumberLiteral(2)),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('foreach (list as i) {2;}', () => {
    let source = 'foreach (list as i) {2;}';
    let expected = [
      new stmt.Foreach(
        null,
        new stmt.Var('i', null, null),
        new expr.Variable('list'),
        new stmt.Block([new stmt.Expression(new expr.NumberLiteral(2))]),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('foreach (list as i: number) 2', () => {
    let source = 'foreach (list as i: number) 2';
    let expected = [
      new stmt.Foreach(
        null,
        new stmt.Var('i', new types.Number(), null),
        new expr.Variable('list'),
        new stmt.Expression(new expr.NumberLiteral(2)),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('foreach (list as i => l) 2', () => {
    let source = 'foreach (list as i => l) 2';
    let expected = [
      new stmt.Foreach(
        new stmt.Var('i', null, null),
        new stmt.Var('l', null, null),
        new expr.Variable('list'),
        new stmt.Expression(new expr.NumberLiteral(2)),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('foreach (list as i: number => l: Rental) 2', () => {
    let source = 'foreach (list as i: number => l: Rental) 2';
    let expected = [
      new stmt.Foreach(
        new stmt.Var('i', new types.Number(), null),
        new stmt.Var('l', new types.Identifier('Rental', []), null),
        new expr.Variable('list'),
        new stmt.Expression(new expr.NumberLiteral(2)),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});
