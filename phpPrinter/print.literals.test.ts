// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter } from './print'
import compile, { resolveUndeclaredIdentifiersToVariables } from '../compiler'

function ast(source: string) {
  return compile(source, {
    resolveUndeclaredIdentifiers: resolveUndeclaredIdentifiersToVariables,
  })
}

function print(source: string) {
  let printer = new PhpPrinter()
  return printer.print(ast(source)).trim()
}

describe('print number literals', () => {
  test('1', () => {
    let source = '1'
    let expected = '1;'
    expect(print(source)).toEqual(expected)
  })

  test('1.2', () => {
    let source = '1.2'
    let expected = '1.2;'
    expect(print(source)).toEqual(expected)
  })

  test('123.456', () => {
    let source = '123.456'
    let expected = '123.456;'
    expect(print(source)).toEqual(expected)
  })

  test('0.123', () => {
    let source = '0.123'
    let expected = '0.123;'
    expect(print(source)).toEqual(expected)
  })

  test('123_456.78_90', () => {
    let source = '123_456.78_90'
    let expected = '123456.7890;'
    expect(print(source)).toEqual(expected)
  })

  test('1_2_3_4_5_6_7_8_9_0', () => {
    let source = '1_2_3_4_5_6_7_8_9_0'
    let expected = '1234567890;'
    expect(print(source)).toEqual(expected)
  })

  test('0b1010', () => {
    let source = '0b1010'
    let expected = '0b1010;'
    expect(print(source)).toEqual(expected)
  })

  test('0b1010_1010', () => {
    let source = '0b1010_1010'
    let expected = '0b10101010;'
    expect(print(source)).toEqual(expected)
  })

  test('0x1', () => {
    let source = '0x1'
    let expected = '0x1;'
    expect(print(source)).toEqual(expected)
  })

  test('0X12', () => {
    let source = '0X12'
    let expected = '0X12;'
    expect(print(source)).toEqual(expected)
  })

  test('0x012_345_678_9AB_CDE_F', () => {
    let source = '0x012_345_678_9AB_CDE_F'
    let expected = '0x0123456789ABCDEF;'
    expect(print(source)).toEqual(expected)
  })

  test('0o1', () => {
    let source = '0o1'
    let expected = '0o1;'
    expect(print(source)).toEqual(expected)
  })

  test('0O10', () => {
    let source = '0O10'
    let expected = '0O10;'
    expect(print(source)).toEqual(expected)
  })

  test('0o012_345_67', () => {
    let source = '0o012_345_67'
    let expected = '0o01234567;'
    expect(print(source)).toEqual(expected)
  })

  test('0b1', () => {
    let source = '0b1'
    let expected = '0b1;'
    expect(print(source)).toEqual(expected)
  })

  test('0B10', () => {
    let source = '0B10'
    let expected = '0B10;'
    expect(print(source)).toEqual(expected)
  })

  test('0b010_101_011', () => {
    let source = '0b010_101_011'
    let expected = '0b010101011;'
    expect(print(source)).toEqual(expected)
  })
})

test('null', () => {
  let source = 'null'
  let expected = 'null;'
  expect(print(source)).toEqual(expected)
})

test('true', () => {
  let source = 'true'
  let expected = 'true;'
  expect(print(source)).toEqual(expected)
})

test('false', () => {
  let source = 'false'
  let expected = 'false;'
  expect(print(source)).toEqual(expected)
})
