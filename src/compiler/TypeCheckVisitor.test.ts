// @ts-ignore
import { expect, test, describe } from 'bun:test'
import * as n from '../nodes'
import compile from './compiler'
import TypeCheckVisitor, { TypeCheckError } from './TypeCheckVisitor'

function check(src: string) {
  let ast = compile(src)
  new TypeCheckVisitor().visit(ast)
}

/*

describe('typecheck var declarations', () => {
  test('var a: string = "1"', () => {
    let src = 'var a: string = "1"'
    expect(() => check(src)).not.toThrow()
  })

  test('var a: string = null', () => {
    let src = 'var a: string = null'
    expect(() => check(src)).toThrowError(
      new TypeCheckError('Type error: null is not assignable to string'),
    )
  })

  test('var a: string = "" +. ""', () => {
    let src = 'var a: string = "" +. ""'
    expect(() => check(src)).not.toThrow()
  })
})

describe('shorthand function syntax', () => {
  test('fun a(): string => ""', () => {
    let src = 'fun a(): string => ""'
    expect(() => check(src)).not.toThrow()
  })

  test('var a = fun(): string => ""', () => {
    let src = 'var a = fun (): string => ""'
    expect(() => check(src)).not.toThrow()
  })

  test('fun a(): string => null', () => {
    let src = 'fun a(): string => null'
    expect(() => check(src)).toThrowError(
      new TypeCheckError('Type error: null is not assignable to string'),
    )
  })

  test('var a = fun(): string => null', () => {
    let src = 'var a = fun (): string => null'
    expect(() => check(src)).toThrowError(
      new TypeCheckError('Type error: null is not assignable to string'),
    )
  })
})

*/
