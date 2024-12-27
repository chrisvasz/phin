// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import { PhpPrinter } from './print'

function print(src: string) {
  return new PhpPrinter().print(parse(scan(src)))
}

describe('function declarations', () => {
  test('fun foo() {}', () => {
    let source = 'fun foo() {}'
    let expected = 'function foo() {}'
    expect(print(source)).toEqual(expected)
  })

  test('fun foo() { return 1; }', () => {
    let source = 'fun foo() { return 1; }'
    let expected = `
function foo() {
return 1;
}
    `.trim()
    expect(print(source)).toEqual(expected)
  })

  test('fun foo() { echo "hello"; return 1; }', () => {
    let source = 'fun foo() { echo "hello"; return 1; }'
    let expected = `
function foo() {
echo "hello";
return 1;
}
    `.trim()
    expect(print(source)).toEqual(expected)
  })

  test('fun foo(a) {}', () => {
    let source = 'fun foo(a) {}'
    let expected = 'function foo($a) {}'
    expect(print(source)).toEqual(expected)
  })

  test('fun foo(a = 3) {}', () => {
    let source = 'fun foo(a = 3) {}'
    let expected = 'function foo($a = 3) {}'
    expect(print(source)).toEqual(expected)
  })

  test('fun foo(a: int = 3): int {}', () => {
    let source = 'fun foo(a: int = 3): int {}'
    let expected = 'function foo(int $a = 3): int {}'
    expect(print(source)).toEqual(expected)
  })

  test('fun foo(a: int|string = 3): int&float {}', () => {
    let source = 'fun foo(a: int|string = 3): int&float {}'
    let expected = 'function foo(int|string $a = 3): int&float {}'
    console.log(print(source))
    expect(print(source)).toEqual(expected)
  })

  test('fun foo(a: array<number>, b: array<string>): Five<T> {}', () => {
    let source = 'fun foo(a: array<number>, b: array<string>): Five<T> {}'
    let expected = `
/**
 * @param array<number> $a
 * @param array<string> $b
 * @return Five<T>
 */
function foo(array $a, array $b): Five {}
    `.trim()
    expect(print(source)).toEqual(expected)
  })

  test.todo('does not overwrite existing docblock')
  test.todo('complex return type like array<int>')
})
