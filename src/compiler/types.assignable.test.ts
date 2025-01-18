// @ts-ignore
import { expect, test, describe } from 'bun:test'
import compile from './compiler'
import { TypeCheckError } from './TypeCheckVisitor'
import { TestSymbols } from '../symbols'
import { b, t } from '../builder'

describe('type assignable: any', () => {
  test('int', () => {
    expect(t.int().isAssignableTo(t.any())).toBe(true)
  })
})
