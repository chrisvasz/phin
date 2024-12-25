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

describe('array literals', () => {
  test('[]', () => {
    let source = '[]';
    let expected = [new stmt.Expression(new expr.ArrayLiteral([]))];
    expect(ast(source)).toEqual(expected);
  });

  test('[1,2,3]', () => {
    let source = '[1,2,3]';
    let expected = [
      new stmt.Expression(
        new expr.ArrayLiteral([
          new expr.ArrayElement(null, new expr.NumberLiteral('1')),
          new expr.ArrayElement(null, new expr.NumberLiteral('2')),
          new expr.ArrayElement(null, new expr.NumberLiteral('3')),
        ]),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('[1,2,3,]', () => {
    let source = '[1,2,3,]';
    let expected = [
      new stmt.Expression(
        new expr.ArrayLiteral([
          new expr.ArrayElement(null, new expr.NumberLiteral('1')),
          new expr.ArrayElement(null, new expr.NumberLiteral('2')),
          new expr.ArrayElement(null, new expr.NumberLiteral('3')),
        ]),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('["a",b(),c<d]', () => {
    let source = '["a",b(),c<d]';
    let expected = [
      new stmt.Expression(
        new expr.ArrayLiteral([
          new expr.ArrayElement(null, new expr.StringLiteral('a')),
          new expr.ArrayElement(
            null,
            new expr.Call(new expr.Identifier('b'), []),
          ),
          new expr.ArrayElement(
            null,
            new expr.Binary(
              new expr.Identifier('c'),
              '<',
              new expr.Identifier('d'),
            ),
          ),
        ]),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('[[1,2],[3,4]]', () => {
    let source = '[[1,2],[3,4]]';
    let expected = [
      new stmt.Expression(
        new expr.ArrayLiteral([
          new expr.ArrayElement(
            null,
            new expr.ArrayLiteral([
              new expr.ArrayElement(null, new expr.NumberLiteral('1')),
              new expr.ArrayElement(null, new expr.NumberLiteral('2')),
            ]),
          ),
          new expr.ArrayElement(
            null,
            new expr.ArrayLiteral([
              new expr.ArrayElement(null, new expr.NumberLiteral('3')),
              new expr.ArrayElement(null, new expr.NumberLiteral('4')),
            ]),
          ),
        ]),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('[1=>2]', () => {
    let source = '[1=>2]';
    let expected = [
      new stmt.Expression(
        new expr.ArrayLiteral([
          new expr.ArrayElement(
            new expr.NumberLiteral('1'),
            new expr.NumberLiteral('2'),
          ),
        ]),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('[1=>2,"3"=>4+5,a()]', () => {
    let source = '[1=>2,"3"=>4+5,a()]';
    let expected = [
      new stmt.Expression(
        new expr.ArrayLiteral([
          new expr.ArrayElement(
            new expr.NumberLiteral('1'),
            new expr.NumberLiteral('2'),
          ),
          new expr.ArrayElement(
            new expr.StringLiteral('3'),
            new expr.Binary(
              new expr.NumberLiteral('4'),
              '+',
              new expr.NumberLiteral('5'),
            ),
          ),
          new expr.ArrayElement(
            null,
            new expr.Call(new expr.Identifier('a'), []),
          ),
        ]),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});
