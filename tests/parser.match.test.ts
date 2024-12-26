// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../scanner';
import parse from '../parser';
import * as nodes from '../nodes';

function ast(source: string) {
  return parse(scan(source));
}

describe('match expressions', () => {
  test('match (1) {}', () => {
    let source = 'match (1) {}';
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.Match(new nodes.NumberLiteral('1'), [], null),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('match (1) { 1 => 2 }', () => {
    let source = 'match (1) { 1 => 2 }';
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.Match(
          new nodes.NumberLiteral('1'),
          [
            new nodes.MatchArm(
              [new nodes.NumberLiteral('1')],
              new nodes.NumberLiteral('2'),
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
      new nodes.ExpressionStatement(
        new nodes.Match(
          new nodes.NumberLiteral('1'),
          [
            new nodes.MatchArm(
              [new nodes.NumberLiteral('1'), new nodes.NumberLiteral('2')],
              new nodes.NumberLiteral('3'),
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
      new nodes.ExpressionStatement(
        new nodes.Match(
          new nodes.NumberLiteral('1'),
          [
            new nodes.MatchArm(
              [new nodes.NumberLiteral('1'), new nodes.NumberLiteral('2')],
              new nodes.NumberLiteral('3'),
            ),
            new nodes.MatchArm(
              [new nodes.NumberLiteral('4'), new nodes.NumberLiteral('5')],
              new nodes.NumberLiteral('6'),
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
      new nodes.ExpressionStatement(
        new nodes.Match(
          new nodes.NumberLiteral('1'),
          [
            new nodes.MatchArm(
              [new nodes.NumberLiteral('1')],
              new nodes.NumberLiteral('2'),
            ),
            new nodes.MatchArm(
              [new nodes.NumberLiteral('3')],
              new nodes.NumberLiteral('4'),
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
      new nodes.ExpressionStatement(
        new nodes.Match(
          new nodes.NumberLiteral('1'),
          [],
          new nodes.NumberLiteral('2'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('match (1) { 1 => 2, default => 3, }', () => {
    let source = 'match (1) { 1 => 2, default => 3, }';
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.Match(
          new nodes.NumberLiteral('1'),
          [
            new nodes.MatchArm(
              [new nodes.NumberLiteral('1')],
              new nodes.NumberLiteral('2'),
            ),
          ],
          new nodes.NumberLiteral('3'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('match(true) { 1 >= 2 => "worked" }', () => {
    let source = 'match(true) { 1 >= 2 => "worked" }';
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.Match(
          new nodes.BooleanLiteral(true),
          [
            new nodes.MatchArm(
              [
                new nodes.Binary(
                  new nodes.NumberLiteral('1'),
                  '>=',
                  new nodes.NumberLiteral('2'),
                ),
              ],
              new nodes.StringLiteral('worked'),
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
      new nodes.ExpressionStatement(
        new nodes.Match(
          new nodes.BooleanLiteral(true),
          [],
          new nodes.ThrowExpression(new nodes.Identifier('a')),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});
