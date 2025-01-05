// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../../scanner'
import parse from '..'
import * as nodes from '../../nodes'
import { b } from '../parser.builder'

function ast(source: string) {
  return parse(scan(source))
}

describe('parse array literals', () => {
  test('[]', () => {
    let source = '[]'
    let expected = b.program(b.expressionStatement(new nodes.ArrayLiteral([])))
    expect(ast(source)).toEqual(expected)
  })

  test('[1,2,3]', () => {
    let source = '[1,2,3]'
    let expected = b.program(
      b.expressionStatement(
        new nodes.ArrayLiteral([
          new nodes.ArrayElement(null, b.numberLiteral('1')),
          new nodes.ArrayElement(null, b.numberLiteral('2')),
          new nodes.ArrayElement(null, b.numberLiteral('3')),
        ]),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('[1,2,3,]', () => {
    let source = '[1,2,3,]'
    let expected = b.program(
      b.expressionStatement(
        new nodes.ArrayLiteral([
          new nodes.ArrayElement(null, b.numberLiteral('1')),
          new nodes.ArrayElement(null, b.numberLiteral('2')),
          new nodes.ArrayElement(null, b.numberLiteral('3')),
        ]),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('["a",b(),c<d]', () => {
    let source = '["a",b(),c<d]'
    let expected = b.program(
      b.expressionStatement(
        new nodes.ArrayLiteral([
          new nodes.ArrayElement(null, b.stringLiteral('a')),
          new nodes.ArrayElement(null, b.call(b.id('b'))),
          new nodes.ArrayElement(null, b.binary(b.id('c'), '<', b.id('d'))),
        ]),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('[[1,2],[3,4]]', () => {
    let source = '[[1,2],[3,4]]'
    let expected = b.program(
      b.expressionStatement(
        new nodes.ArrayLiteral([
          new nodes.ArrayElement(
            null,
            new nodes.ArrayLiteral([
              new nodes.ArrayElement(null, b.numberLiteral('1')),
              new nodes.ArrayElement(null, b.numberLiteral('2')),
            ]),
          ),
          new nodes.ArrayElement(
            null,
            new nodes.ArrayLiteral([
              new nodes.ArrayElement(null, b.numberLiteral('3')),
              new nodes.ArrayElement(null, b.numberLiteral('4')),
            ]),
          ),
        ]),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('[1=>2]', () => {
    let source = '[1=>2]'
    let expected = b.program(
      b.expressionStatement(
        new nodes.ArrayLiteral([
          new nodes.ArrayElement(b.numberLiteral('1'), b.numberLiteral('2')),
        ]),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('["a"=>b]', () => {
    let source = '["a"=>b]'
    let expected = b.program(
      b.expressionStatement(
        new nodes.ArrayLiteral([
          new nodes.ArrayElement(b.stringLiteral('a'), b.id('b')),
        ]),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('[1=>2,"3"=>4+5,a()]', () => {
    let source = '[1=>2,"3"=>4+5,a()]'
    let expected = b.program(
      b.expressionStatement(
        new nodes.ArrayLiteral([
          new nodes.ArrayElement(b.numberLiteral('1'), b.numberLiteral('2')),
          new nodes.ArrayElement(
            b.stringLiteral('3'),
            b.binary(b.numberLiteral('4'), '+', b.numberLiteral('5')),
          ),
          new nodes.ArrayElement(null, b.call(b.id('a'))),
        ]),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse array access', () => {
  test('a[1]', () => {
    let source = 'a[1]'
    let expected = b.program(
      b.expressionStatement(
        new nodes.ArrayAccess(b.id('a'), b.numberLiteral('1')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('a[1][2]', () => {
    let source = 'a[1][2]'
    let expected = b.program(
      b.expressionStatement(
        new nodes.ArrayAccess(
          new nodes.ArrayAccess(b.id('a'), b.numberLiteral('1')),
          b.numberLiteral('2'),
        ),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('a.b[1]', () => {
    let source = 'a.b[1]'
    let expected = b.program(
      b.expressionStatement(
        new nodes.ArrayAccess(
          new nodes.Get(b.id('a'), 'b'),
          b.numberLiteral('1'),
        ),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })
})
