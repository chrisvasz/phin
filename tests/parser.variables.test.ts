// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';
import * as type from '../type';

function ast(source: string) {
  return parse(scan(source));
}

describe('variable declarations', () => {
  test('var x', () => {
    let source = 'var x';
    let expected = [new stmt.Var('x', null, null)];
    expect(ast(source)).toEqual(expected);
  });

  test('var x = 3', () => {
    let source = 'var x = 3';
    let expected = [new stmt.Var('x', null, new expr.NumberLiteral('3'))];
    expect(ast(source)).toEqual(expected);
  });

  test('var x = 3 + 1', () => {
    let source = 'var x = 3 + 1';
    let expected = [
      new stmt.Var(
        'x',
        null,
        new expr.Binary(
          new expr.NumberLiteral('3'),
          '+',
          new expr.NumberLiteral('1'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var x = 3 + 1; var y; var z = "hello"', () => {
    let source = 'var x = 3 + 1; var y; var z = "hello"';
    let expected = [
      new stmt.Var(
        'x',
        null,
        new expr.Binary(
          new expr.NumberLiteral('3'),
          '+',
          new expr.NumberLiteral('1'),
        ),
      ),
      new stmt.Var('y', null, null),
      new stmt.Var('z', null, new expr.StringLiteral('hello')),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: number', () => {
    let source = 'var x: number';
    let expected = [new stmt.Var('x', new type.Number(), null)];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: number = 3', () => {
    let source = 'var x: number = 3';
    let expected = [
      new stmt.Var('x', new type.Number(), new expr.NumberLiteral('3')),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: string', () => {
    let source = 'var x: string';
    let expected = [new stmt.Var('x', new type.String(), null)];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: bool', () => {
    let source = 'var x: bool';
    let expected = [new stmt.Var('x', new type.Boolean(), null)];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: null', () => {
    let source = 'var x: null';
    let expected = [new stmt.Var('x', new type.Null(), null)];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: int', () => {
    let source = 'var x: int';
    let expected = [new stmt.Var('x', new type.Int(), null)];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: float', () => {
    let source = 'var x: float';
    let expected = [new stmt.Var('x', new type.Float(), null)];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: 5', () => {
    let source = 'var x: 5';
    let expected = [new stmt.Var('x', new type.NumberLiteral('5'), null)];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: "hello"', () => {
    let source = 'var x: "hello"';
    let expected = [new stmt.Var('x', new type.StringLiteral('hello'), null)];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: Class', () => {
    let source = 'var x: Class';
    let expected = [new stmt.Var('x', new type.Identifier('Class', []), null)];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: true', () => {
    let source = 'var x: true';
    let expected = [new stmt.Var('x', new type.True(), null)];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: false', () => {
    let source = 'var x: false';
    let expected = [new stmt.Var('x', new type.False(), null)];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: array', () => {
    let source = 'var x: array';
    let expected = [new stmt.Var('x', new type.Identifier('array', []), null)];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: array<number>', () => {
    let source = 'var x: array<number>';
    let expected = [
      new stmt.Var(
        'x',
        new type.Identifier('array', [new type.Number()]),
        null,
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: array<array<array<number>>>', () => {
    let source = 'var x: array<array<array<number>>>';
    let expected = [
      new stmt.Var(
        'x',
        new type.Identifier('array', [
          new type.Identifier('array', [
            new type.Identifier('array', [new type.Number()]),
          ]),
        ]),
        null,
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: array<number|string>', () => {
    let source = 'var x: array<number|string>';
    let expected = [
      new stmt.Var(
        'x',
        new type.Identifier('array', [
          new type.Union([new type.Number(), new type.String()]),
        ]),
        null,
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: array<string,number>', () => {
    let source = 'var x: array<string,number>';
    let expected = [
      new stmt.Var(
        'x',
        new type.Identifier('array', [new type.String(), new type.Number()]),
        null,
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: array<string,>', () => {
    let source = 'var x: array<string,>';
    let expected = [
      new stmt.Var(
        'x',
        new type.Identifier('array', [new type.String()]),
        null,
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: array<string|number,number&null,?5>', () => {
    let source = 'var x: array<string|number,number&null,?5>';
    let expected = [
      new stmt.Var(
        'x',
        new type.Identifier('array', [
          new type.Union([new type.String(), new type.Number()]),
          new type.Intersection([new type.Number(), new type.Null()]),
          new type.Nullable(new type.NumberLiteral('5')),
        ]),
        null,
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: ?number', () => {
    let source = 'var x: ?number';
    let expected = [
      new stmt.Var('x', new type.Nullable(new type.Number()), null),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: string|number', () => {
    let source = 'var x: string|number';
    let expected = [
      new stmt.Var(
        'x',
        new type.Union([new type.String(), new type.Number()]),
        null,
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: string|number|null', () => {
    let source = 'var x: string|number|null';
    let expected = [
      new stmt.Var(
        'x',
        new type.Union([new type.String(), new type.Number(), new type.Null()]),
        null,
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: string&number', () => {
    let source = 'var x: string&number';
    let expected = [
      new stmt.Var(
        'x',
        new type.Intersection([new type.String(), new type.Number()]),
        null,
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('var x: string&number&null', () => {
    let source = 'var x: string&number&null';
    let expected = [
      new stmt.Var(
        'x',
        new type.Intersection([
          new type.String(),
          new type.Number(),
          new type.Null(),
        ]),
        null,
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('abc = 123', () => {
    let source = 'abc = 123';
    let expected = [
      new stmt.Expression(
        new expr.Assign('abc', new expr.NumberLiteral('123')),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});
