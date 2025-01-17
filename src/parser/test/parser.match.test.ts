// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../../scanner'
import parse from '../parser'
import * as nodes from '../../nodes'
import { b } from '../../builder'

function ast(source: string) {
  return parse(scan(source))
}

describe('parse match expressions', () => {
  test('match (1) {}', () => {
    let source = 'match (1) {}'
    let expected = b.program(
      new nodes.ExpressionStatement(
        new nodes.Match(b.intLiteral('1'), [], null),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('match (1) { 1 => 2 }', () => {
    let source = 'match (1) { 1 => 2 }'
    let expected = b.program(
      new nodes.ExpressionStatement(
        new nodes.Match(
          b.intLiteral('1'),
          [new nodes.MatchArm([b.intLiteral('1')], b.intLiteral('2'))],
          null,
        ),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('match (1) { 1, 2 => 3 }', () => {
    let source = 'match (1) { 1, 2 => 3 }'
    let expected = b.program(
      new nodes.ExpressionStatement(
        new nodes.Match(
          b.intLiteral('1'),
          [
            new nodes.MatchArm(
              [b.intLiteral('1'), b.intLiteral('2')],
              b.intLiteral('3'),
            ),
          ],
          null,
        ),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('match (1) { 1, 2 => 3, 4, 5 => 6 }', () => {
    let source = 'match (1) { 1, 2 => 3, 4, 5 => 6 }'
    let expected = b.program(
      new nodes.ExpressionStatement(
        new nodes.Match(
          b.intLiteral('1'),
          [
            new nodes.MatchArm(
              [b.intLiteral('1'), b.intLiteral('2')],
              b.intLiteral('3'),
            ),
            new nodes.MatchArm(
              [b.intLiteral('4'), b.intLiteral('5')],
              b.intLiteral('6'),
            ),
          ],
          null,
        ),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('match (1) { 1, => 2, 3, => 4, }', () => {
    let source = 'match (1) { 1, => 2, 3, => 4, }'
    let expected = b.program(
      new nodes.ExpressionStatement(
        new nodes.Match(
          b.intLiteral('1'),
          [
            new nodes.MatchArm([b.intLiteral('1')], b.intLiteral('2')),
            new nodes.MatchArm([b.intLiteral('3')], b.intLiteral('4')),
          ],
          null,
        ),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('match (1) { default => 2 }', () => {
    let source = 'match (1) { default => 2 }'
    let expected = b.program(
      new nodes.ExpressionStatement(
        new nodes.Match(b.intLiteral('1'), [], b.intLiteral('2')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('match (1) { 1 => 2, default => 3, }', () => {
    let source = 'match (1) { 1 => 2, default => 3, }'
    let expected = b.program(
      new nodes.ExpressionStatement(
        new nodes.Match(
          b.intLiteral('1'),
          [new nodes.MatchArm([b.intLiteral('1')], b.intLiteral('2'))],
          b.intLiteral('3'),
        ),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('match(true) { 1 >= 2 => "worked" }', () => {
    let source = 'match(true) { 1 >= 2 => "worked" }'
    let expected = b.program(
      new nodes.ExpressionStatement(
        new nodes.Match(
          new nodes.BooleanLiteral(true),
          [
            new nodes.MatchArm(
              [new nodes.Binary(b.intLiteral('1'), '>=', b.intLiteral('2'))],
              new nodes.StringLiteral('worked'),
            ),
          ],
          null,
        ),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('match(true) { default => throw a }', () => {
    let source = 'match(true) { default => throw a }'
    let expected = b.program(
      new nodes.ExpressionStatement(
        new nodes.Match(
          new nodes.BooleanLiteral(true),
          [],
          new nodes.ThrowExpression(new nodes.Identifier('a')),
        ),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('match(1) { 1 => match(2) { 2 => 2 } }', () => {
    let source = 'match(1) { 1 => match(2) { 2 => 2 } }'
    let expected = b.program(
      new nodes.ExpressionStatement(
        new nodes.Match(
          b.intLiteral('1'),
          [
            new nodes.MatchArm(
              [b.intLiteral('1')],
              new nodes.Match(
                b.intLiteral('2'),
                [new nodes.MatchArm([b.intLiteral('2')], b.intLiteral('2'))],
                null,
              ),
            ),
          ],
          null,
        ),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse match expressions: precedence', () => {
  test('higher than assignment', () => {
    let source = 'a = match(true) {}'
    let expected = b.program(
      new nodes.ExpressionStatement(
        new nodes.Assign(
          new nodes.Identifier('a'),
          '=',
          new nodes.Match(new nodes.BooleanLiteral(true), [], null),
        ),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('higher than !', () => {
    let source = '!match(true) {}'
    let expected = b.program(
      new nodes.ExpressionStatement(
        new nodes.Unary(
          '!',
          new nodes.Match(new nodes.BooleanLiteral(true), [], null),
        ),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })
})
