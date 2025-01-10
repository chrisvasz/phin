// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../../scanner'
import parse from '../parser'
import { b, t } from '../parser.builder'

function ast(source: string) {
  return parse(scan(source))
}

describe('parse var declarations', () => {
  test('var x', () => {
    let source = 'var x'
    let expected = b.program(b.var('x'))
    expect(ast(source)).toEqual(expected)
  })

  test('var x = 3', () => {
    let source = 'var x = 3'
    let expected = b.program(b.var('x', null, b.numberLiteral('3')))
    expect(ast(source)).toEqual(expected)
  })

  test('var x = 3 + 1', () => {
    let source = 'var x = 3 + 1'
    let expected = b.program(
      b.var(
        'x',
        null,
        b.binary(b.numberLiteral('3'), '+', b.numberLiteral('1')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var x = 3 + 1; var y; var z = "hello"', () => {
    let source = 'var x = 3 + 1; var y; var z = "hello"'
    let expected = b.program(
      b.var(
        'x',
        null,
        b.binary(b.numberLiteral('3'), '+', b.numberLiteral('1')),
      ),
      b.var('y', null, null),
      b.var('z', null, b.stringLiteral('hello')),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var x: number', () => {
    let source = 'var x: number'
    let expected = b.program(b.var('x', t.number()))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: number = 3', () => {
    let source = 'var x: number = 3'
    let expected = b.program(b.var('x', t.number(), b.numberLiteral('3')))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: string', () => {
    let source = 'var x: string'
    let expected = b.program(b.var('x', t.string()))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: bool', () => {
    let source = 'var x: bool'
    let expected = b.program(b.var('x', t.bool()))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: null', () => {
    let source = 'var x: null'
    let expected = b.program(b.var('x', t.null()))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: int', () => {
    let source = 'var x: int'
    let expected = b.program(b.var('x', t.int()))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: float', () => {
    let source = 'var x: float'
    let expected = b.program(b.var('x', t.float()))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: 5', () => {
    let source = 'var x: 5'
    let expected = b.program(b.var('x', t.numberLiteral('5')))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: "hello"', () => {
    let source = 'var x: "hello"'
    let expected = b.program(b.var('x', t.stringLiteral('hello')))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: Class', () => {
    let source = 'var x: Class'
    let expected = b.program(b.var('x', t.id('Class')))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: true', () => {
    let source = 'var x: true'
    let expected = b.program(b.var('x', t.true()))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: false', () => {
    let source = 'var x: false'
    let expected = b.program(b.var('x', t.false()))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array', () => {
    let source = 'var x: array'
    let expected = b.program(b.var('x', t.id('array')))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array<number>', () => {
    let source = 'var x: array<number>'
    let expected = b.program(b.var('x', t.id('array', t.number())))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array<array<array<number>>>', () => {
    let source = 'var x: array<array<array<number>>>'
    let expected = b.program(
      b.var('x', t.id('array', t.id('array', t.id('array', t.number())))),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array<number|string>', () => {
    let source = 'var x: array<number|string>'
    let expected = b.program(
      b.var('x', t.id('array', t.union(t.number(), t.string()))),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array<string,number>', () => {
    let source = 'var x: array<string,number>'
    let expected = b.program(b.var('x', t.id('array', t.string(), t.number())))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array<string,>', () => {
    let source = 'var x: array<string,>'
    let expected = b.program(b.var('x', t.id('array', t.string())))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array<string|number,number&null,?5>', () => {
    let source = 'var x: array<string|number,number&null,?5>'
    let expected = b.program(
      b.var(
        'x',
        t.id(
          'array',
          t.union(t.string(), t.number()),
          t.intersection(t.number(), t.null()),
          t.nullable(t.numberLiteral('5')),
        ),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var x: ?number', () => {
    let source = 'var x: ?number'
    let expected = b.program(b.var('x', t.nullable(t.number()), null))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: string|number', () => {
    let source = 'var x: string|number'
    let expected = b.program(b.var('x', t.union(t.string(), t.number()), null))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: string|number|null', () => {
    let source = 'var x: string|number|null'
    let expected = b.program(
      b.var('x', t.union(t.string(), t.number(), t.null()), null),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var x: string&number', () => {
    let source = 'var x: string&number'
    let expected = b.program(
      b.var('x', t.intersection(t.string(), t.number()), null),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var x: string&number&null', () => {
    let source = 'var x: string&number&null'
    let expected = b.program(
      b.var('x', t.intersection(t.string(), t.number(), t.null()), null),
    )
    expect(ast(source)).toEqual(expected)
  })

  test.todo('val declarations')
})
