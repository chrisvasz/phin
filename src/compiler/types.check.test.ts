// @ts-ignore
import { expect, test, describe } from 'bun:test'
import compile from './compiler'
import { TypeCheckError } from './TypeCheckVisitor'
import { TestSymbols } from '../symbols'
import { b, t } from '../builder'

describe('typecheck: var declarations with explicit annotations', () => {
  test('var a: string = ""', () => {
    let src = 'var a: string = ""'
    expect(() => compile(src)).not.toThrow()
  })

  test('var a: string = null', () => {
    let src = 'var a: string = null'
    expect(() => compile(src)).toThrowError(
      new TypeCheckError('Type error: null is not assignable to string'),
    )
  })
})

describe('typecheck: assign expression', () => {
  test('var a = 1; a = 2', () => {
    let src = 'var a = 1; a = 2'
    expect(() => compile(src)).not.toThrow()
  })

  test('var a = 1; a = ""', () => {
    let src = 'var a = 1; a = ""'
    expect(() => compile(src)).toThrowError(
      new TypeCheckError('Type error: string is not assignable to int'),
    )
  })

  test('var a = [1]; a[0] = 1', () => {
    let src = 'var a = [1]; a[0] = 1'
    expect(() => compile(src)).not.toThrow()
  })

  test('var a = [1]; a[0] = ""', () => {
    let src = 'var a = [1]; a[0] = ""'
    expect(() => compile(src)).toThrowError(
      new TypeCheckError('Type error: string is not assignable to int'),
    )
  })

  test('class A { var b = 1 }; var c = new A; c.b = 1', () => {
    let src = 'class A { var b = 1 }; var c = new A; c.b = 1'
    expect(() => compile(src)).not.toThrow()
  })

  test('class A { var b = 1 }; var c = new A; c.b = ""', () => {
    let src = 'class A { var b = 1 }; var c = new A; c.b = ""'
    expect(() => compile(src)).toThrowError(
      new TypeCheckError('Type error: string is not assignable to int'),
    )
  })
})

describe('typecheck: call expression', () => {
  test('fun a() => null; a()', () => {
    let src = 'fun a() => null; a()'
    expect(() => compile(src)).not.toThrow()
  })

  test('var a = 1; a()', () => {
    let src = 'var a = 1; a()'
    expect(() => compile(src)).toThrowError(
      new TypeCheckError('Cannot call non-function'),
    )
  })

  test('class A { fun b() => null }; var c = new A; c.b()', () => {
    let src = 'class A { fun b() => null }; var c = new A; c.b()'
    expect(() => compile(src)).not.toThrow()
  })

  test('class A { var b = 1 }; var c = new A; c.b()', () => {
    let src = 'class A { var b = 1 }; var c = new A; c.b()'
    expect(() => compile(src)).toThrowError(
      new TypeCheckError('Cannot call non-function'),
    )
  })
})

test.todo('class const with explicit annotations')
test.todo('function shorthand return')
test.todo('callsite params')
