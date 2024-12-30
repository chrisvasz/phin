// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import * as nodes from '../nodes'

function ast(source: string) {
  return parse(scan(source))
}

describe('parse array literals', () => {
  test('[]', () => {
    let source = '[]'
    let expected = [new nodes.ExpressionStatement(new nodes.ArrayLiteral([]))]
    expect(ast(source)).toEqual(expected)
  })

  test('[1,2,3]', () => {
    let source = '[1,2,3]'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.ArrayLiteral([
          new nodes.ArrayElement(null, new nodes.NumberLiteral('1')),
          new nodes.ArrayElement(null, new nodes.NumberLiteral('2')),
          new nodes.ArrayElement(null, new nodes.NumberLiteral('3')),
        ]),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('[1,2,3,]', () => {
    let source = '[1,2,3,]'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.ArrayLiteral([
          new nodes.ArrayElement(null, new nodes.NumberLiteral('1')),
          new nodes.ArrayElement(null, new nodes.NumberLiteral('2')),
          new nodes.ArrayElement(null, new nodes.NumberLiteral('3')),
        ]),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('["a",b(),c<d]', () => {
    let source = '["a",b(),c<d]'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.ArrayLiteral([
          new nodes.ArrayElement(null, new nodes.StringLiteral('a')),
          new nodes.ArrayElement(
            null,
            new nodes.Call(new nodes.Identifier('b'), []),
          ),
          new nodes.ArrayElement(
            null,
            new nodes.Binary(
              new nodes.Identifier('c'),
              '<',
              new nodes.Identifier('d'),
            ),
          ),
        ]),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('[[1,2],[3,4]]', () => {
    let source = '[[1,2],[3,4]]'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.ArrayLiteral([
          new nodes.ArrayElement(
            null,
            new nodes.ArrayLiteral([
              new nodes.ArrayElement(null, new nodes.NumberLiteral('1')),
              new nodes.ArrayElement(null, new nodes.NumberLiteral('2')),
            ]),
          ),
          new nodes.ArrayElement(
            null,
            new nodes.ArrayLiteral([
              new nodes.ArrayElement(null, new nodes.NumberLiteral('3')),
              new nodes.ArrayElement(null, new nodes.NumberLiteral('4')),
            ]),
          ),
        ]),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('[1=>2]', () => {
    let source = '[1=>2]'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.ArrayLiteral([
          new nodes.ArrayElement(
            new nodes.NumberLiteral('1'),
            new nodes.NumberLiteral('2'),
          ),
        ]),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('[1=>2,"3"=>4+5,a()]', () => {
    let source = '[1=>2,"3"=>4+5,a()]'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.ArrayLiteral([
          new nodes.ArrayElement(
            new nodes.NumberLiteral('1'),
            new nodes.NumberLiteral('2'),
          ),
          new nodes.ArrayElement(
            new nodes.StringLiteral('3'),
            new nodes.Binary(
              new nodes.NumberLiteral('4'),
              '+',
              new nodes.NumberLiteral('5'),
            ),
          ),
          new nodes.ArrayElement(
            null,
            new nodes.Call(new nodes.Identifier('a'), []),
          ),
        ]),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse array access', () => {
  test('a[1]', () => {
    let source = 'a[1]'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.ArrayAccess(
          new nodes.Identifier('a'),
          new nodes.NumberLiteral('1'),
        ),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('a[1][2]', () => {
    let source = 'a[1][2]'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.ArrayAccess(
          new nodes.ArrayAccess(
            new nodes.Identifier('a'),
            new nodes.NumberLiteral('1'),
          ),
          new nodes.NumberLiteral('2'),
        ),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('a.b[1]', () => {
    let source = 'a.b[1]'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.ArrayAccess(
          new nodes.Get(new nodes.Identifier('a'), 'b'),
          new nodes.NumberLiteral('1'),
        ),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })
})
