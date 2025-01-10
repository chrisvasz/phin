// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../../scanner'
import parse from '../parser'
import { b, t } from '../parser.builder'

function ast(source: string) {
  return parse(scan(source))
}

describe('parse destructuring in var assignment', () => {
  test('var [a] = e', () => {
    let source = 'var [a] = e'
    let expected = b.program(
      b.varDestructuring(
        b.destructuring(b.destructuringElement(null, 'a')),
        b.id('e'),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var [a, b] = e', () => {
    let source = 'var [a, b] = e'
    let expected = b.program(
      b.varDestructuring(
        b.destructuring(
          b.destructuringElement(null, 'a'),
          b.destructuringElement(null, 'b'),
        ),
        b.id('e'),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var [, , c] = e', () => {
    let source = 'var [, , c] = e'
    let expected = b.program(
      b.varDestructuring(
        b.destructuring(null, null, b.destructuringElement(null, 'c')),
        b.id('e'),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var [a: int, , c] = e', () => {
    let source = 'var [a: int, , c] = e'
    let expected = b.program(
      b.varDestructuring(
        b.destructuring(
          b.destructuringElement(null, 'a', t.int()),
          null,
          b.destructuringElement(null, 'c'),
        ),
        b.id('e'),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test(`var ["b" => a] = e`, () => {
    let source = `var ["b" => a] = e`
    let expected = b.program(
      b.varDestructuring(
        b.destructuring(b.destructuringElement('b', 'a')),
        b.id('e'),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test(`var ["b" => a: string, "c" => b: array<int>] = e`, () => {
    let source = `var ["b" => a: string, "c" => b: array<int>] = e`
    let expected = b.program(
      b.varDestructuring(
        b.destructuring(
          b.destructuringElement('b', 'a', t.string()),
          b.destructuringElement('c', 'b', t.array(t.int())),
        ),
        b.id('e'),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })
})

describe('parse destructuring in foreach', () => {
  test('foreach (a as [b]) {}', () => {
    let source = 'foreach (a as [b]) {}'
    let expected = b.program(
      b.foreach(
        null,
        b.destructuring(b.destructuringElement(null, 'b')),
        b.id('a'),
        b.block(),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('foreach (a as ["c" => b: int]) {}', () => {
    let source = 'foreach (a as ["c" => b: int]) {}'
    let expected = b.program(
      b.foreach(
        null,
        b.destructuring(b.destructuringElement('c', 'b', t.int())),
        b.id('a'),
        b.block(),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })
})
