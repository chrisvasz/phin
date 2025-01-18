// @ts-ignore
import { expect, test, describe } from 'bun:test'
import compile from './compiler'
import { TypeCheckError } from './TypeCheckVisitor'
import { TestSymbols } from '../symbols'
import { b, t } from '../builder'

describe('type assignable: any', () => {
  test('any', () => {
    expect(t.any().contains(t.int())).toBe(true)
    expect(t.any().contains(t.string())).toBe(true)
    expect(t.any().contains(t.nullable(t.int()))).toBe(true)
  })
})

describe('type assignable: bool', () => {
  test('bool to bool', () => {
    expect(t.bool().contains(t.bool())).toBe(true)
  })

  test('true to bool', () => {
    expect(t.bool().contains(t.true())).toBe(true)
  })

  test('false to bool', () => {
    expect(t.bool().contains(t.false())).toBe(true)
  })

  test('true to false', () => {
    expect(t.false().contains(t.true())).toBe(false)
  })

  test('false to true', () => {
    expect(t.true().contains(t.false())).toBe(false)
  })

  test('int to bool', () => {})
})

describe('type assignable: int', () => {
  test('int to int', () => {
    expect(t.int().contains(t.int())).toBe(true)
  })

  test('7 to int', () => {
    expect(t.int().contains(t.intLiteral('7'))).toBe(true)
  })

  test('int to 7', () => {
    expect(t.intLiteral('7').contains(t.int())).toBe(false)
  })

  test('float to int', () => {
    expect(t.int().contains(t.float())).toBe(false)
  })
})

describe('type assignable: float', () => {
  test('float to float', () => {
    expect(t.float().contains(t.float())).toBe(true)
  })

  test('7.1 to float', () => {
    expect(t.float().contains(t.floatLiteral('7.1'))).toBe(true)
  })

  test('float to 7.1', () => {
    expect(t.floatLiteral('7.1').contains(t.float())).toBe(false)
  })

  test('int to float', () => {
    expect(t.float().contains(t.int())).toBe(false)
  })
})

describe('type assignable: string', () => {
  test('string to string', () => {
    expect(t.string().contains(t.string())).toBe(true)
  })

  test('"" to string', () => {
    expect(t.string().contains(t.stringLiteral('""'))).toBe(true)
  })

  test('string to ""', () => {
    expect(t.stringLiteral('""').contains(t.string())).toBe(false)
  })

  test('int to string', () => {
    expect(t.string().contains(t.int())).toBe(false)
  })
})

describe('type assignable: nullable', () => {
  test('null to ?int', () => {
    expect(t.nullable(t.int()).contains(t.null())).toBe(true)
  })

  test('int to ?int', () => {
    expect(t.nullable(t.int()).contains(t.int())).toBe(true)
  })

  test('int to ?string', () => {
    expect(t.nullable(t.string()).contains(t.int())).toBe(false)
  })

  test('?int to ?int', () => {
    expect(t.nullable(t.int()).contains(t.nullable(t.int()))).toBe(true)
  })

  test('?int to ?string', () => {
    expect(t.nullable(t.string()).contains(t.nullable(t.int()))).toBe(false)
  })
})

describe('type assignable: union', () => {
  test('int to int|string', () => {
    expect(t.union(t.int(), t.string()).contains(t.int())).toBe(true)
  })

  test('string to int|string', () => {
    expect(t.union(t.int(), t.string()).contains(t.string())).toBe(true)
  })

  test('float to int|string', () => {
    expect(t.union(t.int(), t.string()).contains(t.float())).toBe(false)
  })
})

describe('type assignable: function', () => {
  test('() => int to () => int', () => {
    expect(t.fun([], t.int()).contains(t.fun([], t.int()))).toBe(true)
  })

  test('() => int to () => string', () => {
    expect(t.fun([], t.string()).contains(t.fun([], t.int()))).toBe(false)
  })

  test('(int) => int to (int) => int', () => {
    expect(t.fun([t.int()], t.int()).contains(t.fun([t.int()], t.int()))).toBe(
      true,
    )
  })

  test('(int) => int to (string) => int', () => {
    expect(
      t.fun([t.string()], t.int()).contains(t.fun([t.int()], t.int())),
    ).toBe(false)
  })

  test('(int, int) => int to (int) => int', () => {
    expect(
      t.fun([t.int()], t.int()).contains(t.fun([t.int(), t.int()], t.int())),
    ).toBe(false)
  })
})

test.todo('void')
test.todo('never')
