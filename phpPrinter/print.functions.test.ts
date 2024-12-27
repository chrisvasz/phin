// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import { PhpPrinter } from './print'
import { Kind } from './environment'

function print(src: string) {
  let result = new PhpPrinter(() => Kind.Function).print(parse(scan(src)))
  return result.trim()
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

  test('fun foo() => 1', () => {
    let source = 'fun foo() => 1'
    let expected = `
function foo() {
  return 1;
}
    `.trim()
    expect(print(source)).toEqual(expected)
  })

  test.todo('does not overwrite existing docblock')
})

describe('function expressions', () => {
  test('var a = fun() {}', () => {
    let source = 'var a = fun() {}'
    let expected = '$a = function () {};'
    expect(print(source)).toEqual(expected)
  })

  test('var a = fun(a) => 5', () => {
    let source = 'var a = fun(a) => 5'
    let expected = `
$a = function ($a) {
  return 5;
};
    `.trim()
    expect(print(source)).toEqual(expected)
  })

  test.todo('var a = fun(a: array<int>) {}')
})

describe('function calls', () => {
  test('foo()', () => {
    let source = 'foo()'
    let expected = 'foo();'
    expect(print(source)).toEqual(expected)
  })

  test('foo(a(), b+2)', () => {
    let source = 'foo(a(), b+2)'
    let expected = 'foo(a(), b + 2);'
    expect(print(source)).toEqual(expected)
  })

  test.todo('a.b()')
})
