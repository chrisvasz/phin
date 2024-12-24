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

describe('match expressions', () => {
  test('match (1) {}', () => {
    let source = 'match (1) {}';
    let expected = [
      new stmt.Expression(
        new expr.Match(new expr.NumberLiteral('1'), [], null),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('match (1) { 1 => 2 }', () => {
    let source = 'match (1) { 1 => 2 }';
    let expected = [
      new stmt.Expression(
        new expr.Match(
          new expr.NumberLiteral('1'),
          [
            new expr.MatchArm(
              [new expr.NumberLiteral('1')],
              new expr.NumberLiteral('2'),
            ),
          ],
          null,
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('match (1) { 1, 2 => 3 }', () => {
    let source = 'match (1) { 1, 2 => 3 }';
    let expected = [
      new stmt.Expression(
        new expr.Match(
          new expr.NumberLiteral('1'),
          [
            new expr.MatchArm(
              [new expr.NumberLiteral('1'), new expr.NumberLiteral('2')],
              new expr.NumberLiteral('3'),
            ),
          ],
          null,
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('match (1) { 1, 2 => 3, 4, 5 => 6 }', () => {
    let source = 'match (1) { 1, 2 => 3, 4, 5 => 6 }';
    let expected = [
      new stmt.Expression(
        new expr.Match(
          new expr.NumberLiteral('1'),
          [
            new expr.MatchArm(
              [new expr.NumberLiteral('1'), new expr.NumberLiteral('2')],
              new expr.NumberLiteral('3'),
            ),
            new expr.MatchArm(
              [new expr.NumberLiteral('4'), new expr.NumberLiteral('5')],
              new expr.NumberLiteral('6'),
            ),
          ],
          null,
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('match (1) { 1, => 2, 3, => 4, }', () => {
    let source = 'match (1) { 1, => 2, 3, => 4, }';
    let expected = [
      new stmt.Expression(
        new expr.Match(
          new expr.NumberLiteral('1'),
          [
            new expr.MatchArm(
              [new expr.NumberLiteral('1')],
              new expr.NumberLiteral('2'),
            ),
            new expr.MatchArm(
              [new expr.NumberLiteral('3')],
              new expr.NumberLiteral('4'),
            ),
          ],
          null,
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('match (1) { default => 2 }', () => {
    let source = 'match (1) { default => 2 }';
    let expected = [
      new stmt.Expression(
        new expr.Match(
          new expr.NumberLiteral('1'),
          [],
          new expr.NumberLiteral('2'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('match (1) { 1 => 2, default => 3, }', () => {
    let source = 'match (1) { 1 => 2, default => 3, }';
    let expected = [
      new stmt.Expression(
        new expr.Match(
          new expr.NumberLiteral('1'),
          [
            new expr.MatchArm(
              [new expr.NumberLiteral('1')],
              new expr.NumberLiteral('2'),
            ),
          ],
          new expr.NumberLiteral('3'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('match(true) { 1 >= 2 => "worked" }', () => {
    let source = 'match(true) { 1 >= 2 => "worked" }';
    let expected = [
      new stmt.Expression(
        new expr.Match(
          new expr.BooleanLiteral(true),
          [
            new expr.MatchArm(
              [
                new expr.Binary(
                  new expr.NumberLiteral('1'),
                  '>=',
                  new expr.NumberLiteral('2'),
                ),
              ],
              new expr.StringLiteral('worked'),
            ),
          ],
          null,
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('match(true) { default => throw a }', () => {
    let source = 'match(true) { default => throw a }';
    let expected = [
      new stmt.Expression(
        new expr.Match(
          new expr.BooleanLiteral(true),
          [],
          new expr.Throw(new expr.Variable('a')),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});
