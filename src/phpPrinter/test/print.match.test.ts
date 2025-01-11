// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter } from '../print'
import { trimMargin } from '../trimMargin'
import compile, {
  resolveUndeclaredIdentifiersToVariables,
} from '../../compiler'

function ast(source: string) {
  return compile(source, {
    resolveUndeclaredIdentifiers: resolveUndeclaredIdentifiersToVariables,
  })
}

function print(source: string) {
  let printer = new PhpPrinter()
  return printer.print(ast(source)).trim()
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
