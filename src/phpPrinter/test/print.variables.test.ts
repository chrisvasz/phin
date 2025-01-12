// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter } from '../print'
import compile from '../../compiler'

function print(source: string) {
  let ast = compile(source)
  let printer = new PhpPrinter()
  return printer.print(ast).trim()
}

describe('print variables', () => {
  test('var a;', () => {
    let source = 'var a;'
    let expected = '$a;'
    expect(print(source)).toEqual(expected)
  })

  test('var a = 1;', () => {
    let source = 'var a = 1;'
    let expected = '$a = 1;'
    expect(print(source)).toEqual(expected)
  })

  test('var a: string = "";', () => {
    let source = 'var a: string = "";'
    let expected = '/** @var string $a */\n$a = "";'
    expect(print(source)).toEqual(expected)
  })

  test('var a: string = "1" +. "2";', () => {
    let source = 'var a: string = "1" +. "2";'
    let expected = '/** @var string $a */\n$a = "1" . "2";'
    expect(print(source)).toEqual(expected)
  })
})
