// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import { PhpPrinter, PrintError } from './print'
import { Kind } from './environment'
import { trimMargin } from './trimMargin'

function print(src: string) {
  let result = new PhpPrinter(() => Kind.Variable).print(parse(scan(src)))
  return result.trim()
}

describe('print: match', () => {
  test('match (true) {}', () => {
    let source = 'match (true) {}'
    let expected = 'match (true) {};'
    expect(print(source)).toEqual(expected)
  })

  test('match (a()) {}', () => {
    let source = 'match (a()) {}'
    let expected = 'match ($a()) {};'
    expect(print(source)).toEqual(expected)
  })

  test('match (true) { 1 => 1 }', () => {
    let source = 'match (true) { 1 => 1 }'
    let expected = trimMargin(`
      match (true) {
        1 => 1,
      };
    `)
    expect(print(source)).toEqual(expected)
  })

  test('match (true) { 1, 2 => 3, a(), b < 2 => 5 }', () => {
    let source = 'match (true) { 1, 2 => 3, a(), b < 2 => 5 }'
    let expected = trimMargin(`
      match (true) {
        1, 2 => 3,
        $a(), $b < 2 => 5,
      };
    `)
    expect(print(source)).toEqual(expected)
  })

  test('match (true) { 1 => 2, default => 6 }', () => {
    let source = 'match (true) { 1 => 2, default => 6 }'
    let expected = trimMargin(`
      match (true) {
        1 => 2,
        default => 6,
      };
    `)
    expect(print(source)).toEqual(expected)
  })

  test('match (true) { default => throw b }', () => {
    let source = 'match (true) { default => throw b }'
    let expected = trimMargin(`
      match (true) {
        default => throw $b,
      };
    `)
    expect(print(source)).toEqual(expected)
  })
})
