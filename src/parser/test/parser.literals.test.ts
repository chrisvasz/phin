// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../../scanner'
import parse from '../parser'
import * as nodes from '../../nodes'
import { Expr } from '../../nodes'
import { b } from '../../builder'

function ast(source: string) {
  return parse(scan(source))
}

function program(expr: Expr) {
  return b.program(b.expressionStatement(expr))
}

describe('parse literals', () => {
  test('null', () => {
    let source = 'null'
    let expected = program(new nodes.NullLiteral())
    expect(ast(source)).toEqual(expected)
  })

  test('true', () => {
    let source = 'true'
    let expected = program(new nodes.BooleanLiteral(true))
    expect(ast(source)).toEqual(expected)
  })

  test('false', () => {
    let source = 'false'
    let expected = program(new nodes.BooleanLiteral(false))
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse number literals', () => {
  test('1', () => {
    let source = '1'
    let expected = program(b.intLiteral('1'))
    expect(ast(source)).toEqual(expected)
  })

  test('1.2', () => {
    let source = '1.2'
    let expected = program(b.floatLiteral('1.2'))
    expect(ast(source)).toEqual(expected)
  })

  test('123', () => {
    let source = '123'
    let expected = program(b.intLiteral('123'))
    expect(ast(source)).toEqual(expected)
  })

  test('123_', () => {
    let source = '123_'
    let expected = program(b.intLiteral('123'))
    expect(ast(source)).toEqual(expected)
  })

  test('123.45', () => {
    let source = '123.45'
    let expected = program(b.floatLiteral('123.45'))
    expect(ast(source)).toEqual(expected)
  })

  test('123_456', () => {
    let source = '123_456'
    let expected = program(b.intLiteral('123456'))
    expect(ast(source)).toEqual(expected)
  })

  test('123_456.78', () => {
    let source = '123_456.78'
    let expected = program(b.floatLiteral('123456.78'))
    expect(ast(source)).toEqual(expected)
  })

  test('123_456.78_90', () => {
    let source = '123_456.78_90'
    let expected = program(b.floatLiteral('123456.7890'))
    expect(ast(source)).toEqual(expected)
  })

  test('1_2_3_4_5_6_7_8_9_0', () => {
    let source = '1_2_3_4_5_6_7_8_9_0'
    let expected = program(b.intLiteral('1234567890'))
    expect(ast(source)).toEqual(expected)
  })

  test('0x1', () => {
    let source = '0x1'
    let expected = program(b.intLiteral('0x1'))
    expect(ast(source)).toEqual(expected)
  })

  test('0X12', () => {
    let source = '0X12'
    let expected = program(b.intLiteral('0X12'))
    expect(ast(source)).toEqual(expected)
  })

  test('0x012_345_678_9AB_CDE_F', () => {
    let source = '0x012_345_678_9AB_CDE_F'
    let expected = program(b.intLiteral('0x0123456789ABCDEF'))
    expect(ast(source)).toEqual(expected)
  })

  test('0o1', () => {
    let source = '0o1'
    let expected = program(b.intLiteral('0o1'))
    expect(ast(source)).toEqual(expected)
  })

  test('0O10', () => {
    let source = '0O10'
    let expected = program(b.intLiteral('0O10'))
    expect(ast(source)).toEqual(expected)
  })

  test('0o012_345_67', () => {
    let source = '0o012_345_67'
    let expected = program(b.intLiteral('0o01234567'))
    expect(ast(source)).toEqual(expected)
  })

  test('0b1', () => {
    let source = '0b1'
    let expected = program(b.intLiteral('0b1'))
    expect(ast(source)).toEqual(expected)
  })

  test('0B10', () => {
    let source = '0B10'
    let expected = program(b.intLiteral('0B10'))
    expect(ast(source)).toEqual(expected)
  })

  test('0b010_101_011', () => {
    let source = '0b010_101_011'
    let expected = program(b.intLiteral('0b010101011'))
    expect(ast(source)).toEqual(expected)
  })
})
