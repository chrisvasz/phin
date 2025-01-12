// @ts-ignore
import { expect, test, describe } from 'bun:test'
import compile from './compiler'
import { TypeCheckError } from './TypeCheckVisitor'

describe('type check: var declarations with explicit annotations', () => {
  test('var a: string = "1"', () => {
    let src = 'var a: string = "1"'
    expect(() => compile(src)).not.toThrow()
  })

  test('var a: string = null', () => {
    let src = 'var a: string = null'
    expect(() => compile(src)).toThrowError(
      new TypeCheckError('Type error: null is not assignable to string'),
    )
  })

  test('var a: string = "" +. ""', () => {
    let src = 'var a: string = "" +. ""'
    expect(() => compile(src)).not.toThrow()
  })
})
