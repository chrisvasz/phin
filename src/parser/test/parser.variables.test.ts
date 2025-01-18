// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../../scanner'
import parse from '../parser'
import { b, t } from '../../builder'

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
    let expected = b.program(b.var('x', null, b.intLiteral('3')))
    expect(ast(source)).toEqual(expected)
  })

  test('var x = 3 + 1', () => {
    let source = 'var x = 3 + 1'
    let expected = b.program(
      b.var('x', null, b.binary(b.intLiteral('3'), '+', b.intLiteral('1'))),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var x = 3 + 1; var y; var z = "hello"', () => {
    let source = 'var x = 3 + 1; var y; var z = "hello"'
    let expected = b.program(
      b.var('x', null, b.binary(b.intLiteral('3'), '+', b.intLiteral('1'))),
      b.var('y', null, null),
      b.var('z', null, b.stringLiteral('hello')),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var x: int', () => {
    let source = 'var x: int'
    let expected = b.program(b.var('x', t.int()))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: int = 3', () => {
    let source = 'var x: int = 3'
    let expected = b.program(b.var('x', t.int(), b.intLiteral('3')))
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
    let expected = b.program(b.var('x', t.array()))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array<int>', () => {
    let source = 'var x: array<int>'
    let expected = b.program(b.var('x', t.array(t.int())))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array<array<array<int>>>', () => {
    let source = 'var x: array<array<array<int>>>'
    let expected = b.program(b.var('x', t.array(t.array(t.array(t.int())))))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array<int|string>', () => {
    let source = 'var x: array<int|string>'
    let expected = b.program(b.var('x', t.array(t.union(t.int(), t.string()))))
    expect(ast(source)).toEqual(expected)
  })

  test.todo('var x: array<string,int>')

  test.todo('var x: array<string,>', () => {
    let source = 'var x: array<string,>'
    let expected = b.program(b.var('x', t.array(t.string())))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: ?int', () => {
    let source = 'var x: ?int'
    let expected = b.program(b.var('x', t.nullable(t.int()), null))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: string|int', () => {
    let source = 'var x: string|int'
    let expected = b.program(b.var('x', t.union(t.string(), t.int()), null))
    expect(ast(source)).toEqual(expected)
  })

  test('var x: string|int|null', () => {
    let source = 'var x: string|int|null'
    let expected = b.program(
      b.var('x', t.union(t.string(), t.int(), t.null()), null),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var x: string&int', () => {
    let source = 'var x: string&int'
    let expected = b.program(
      b.var('x', t.intersection(t.string(), t.int()), null),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var x: string&int&null', () => {
    let source = 'var x: string&int&null'
    let expected = b.program(
      b.var('x', t.intersection(t.string(), t.int(), t.null()), null),
    )
    expect(ast(source)).toEqual(expected)
  })

  test.todo('val declarations')
})
