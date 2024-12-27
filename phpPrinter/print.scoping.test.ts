// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import { PhpPrinter, PrintError } from './print'

function print(src: string) {
  let result = new PhpPrinter().print(parse(scan(src)))
  return result.trim()
}

describe('print scoping: vars and functions', () => {
  test('a', () => {
    let source = 'a'
    expect(() => print(source)).toThrow(new PrintError('Unknown identifier a'))
  })

  test('var a; a', () => {
    let source = 'var a; a;'
    let expected = '$a;\n$a;'
    expect(print(source)).toEqual(expected)
  })

  test('a; fun a() {}', () => {
    let source = 'a; fun a() {}'
    let expected = 'a;\nfunction a() {}'
    expect(print(source)).toEqual(expected)
  })

  test('b; fun a() {}', () => {
    let source = 'b; fun a() {}'
    expect(() => print(source)).toThrow(new PrintError('Unknown identifier b'))
  })

  test('fun a() {} a;', () => {
    let source = 'fun a() {} a;'
    let expected = 'function a() {}\na;'
    expect(print(source)).toEqual(expected)
  })

  test('fun a() {} var a; a', () => {
    let source = 'fun a() {} var a; a;'
    let expected = 'function a() {}\n$a;\n$a;'
    expect(print(source)).toEqual(expected)
  })

  test('var a; fun a() {} a;', () => {
    let source = 'var a; fun a() {} a;'
    let expected = '$a;\nfunction a() {}\na;'
    expect(print(source)).toEqual(expected)
  })

  test('fun a() { var b; } b;', () => {
    let source = 'fun a() { var b; } b;'
    expect(() => print(source)).toThrow(new PrintError('Unknown identifier b'))
  })

  test('fun a(b) => b', () => {
    let source = 'fun a(b) => b'
    let expected = 'function a($b) {\n  return $b;\n}'
    expect(print(source)).toEqual(expected)
  })

  test('fun a(b, c = b) {}', () => {
    let source = 'fun a(b, c = b) {}'
    let expected = 'function a($b, $c = $b) {}'
    expect(print(source)).toEqual(expected)
  })

  test('fun a(c = b) {}', () => {
    let source = 'fun a(c = b) {}'
    expect(() => print(source)).toThrow(new PrintError('Unknown identifier b'))
  })
})

describe('print scoping: classes', () => {
  test('class A {} A;', () => {
    let source = 'class A {} A;'
    let expected = 'class A {}\nA;'
    expect(print(source)).toEqual(expected)
  })

  test('A; class A {}', () => {
    let source = 'A; class A {}'
    let expected = 'A;\nclass A {}'
    expect(print(source)).toEqual(expected)
  })

  test('class A { var b; fun c() => b; }', () => {
    let source = 'class A { var b; fun c() => b }'
    let expected = `
class A {
  $b;
  function c() {
    return $this->b;
  }
}
    `.trim()
    expect(print(source)).toEqual(expected)
  })

  test('class A { var b; } b;', () => {
    let source = 'class A { var b; } b;'
    expect(() => print(source)).toThrow(new PrintError('Unknown identifier b'))
  })
})

describe('print scoping: foreach', () => {
  test('foreach (a as b) {}', () => {
    let source = 'var a; foreach (a as b) {}'
    let expected = '$a;\nforeach ($a as $b) {}'
    expect(print(source)).toEqual(expected)
  })

  test('foreach (a as b) { b; }', () => {
    let source = 'var a; foreach (a as b) { b; }'
    let expected = `
$a;
foreach ($a as $b) {
  $b;
}
    `.trim()
    expect(print(source)).toEqual(expected)
  })

  test('foreach (a as key => b) { b; }', () => {
    let source = 'var a; foreach (a as key => b) { b;key; }'
    let expected = `
$a;
foreach ($a as $key => $b) {
  $b;
  $key;
}
    `.trim()
    expect(print(source)).toEqual(expected)
  })
})
