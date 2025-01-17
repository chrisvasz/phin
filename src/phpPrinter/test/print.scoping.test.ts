// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter } from '../print'
import compile from '../../compiler'

function print(source: string) {
  const ast = compile(source, {
    buildEnvironment: true,
    typecheck: false,
  })
  let printer = new PhpPrinter()
  return printer.print(ast).trim()
}

describe('print scoping: vars and functions', () => {
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

  test.todo('var a; fun a() {} a;', () => {
    // what should this do? what's the right PHP semantic?
    let source = 'var a; fun a() {} a;'
    let expected = '$a;\nfunction a() {}\na;'
    expect(print(source)).toEqual(expected)
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

  test('fun a() { var b; b; }', () => {
    let source = 'fun a() { var b; b; }'
    let expected = `
function a() {
  $b;
  $b;
}
    `.trim()
    expect(print(source)).toEqual(expected)
  })
})

describe('print scoping: classes', () => {
  test('class A {} A;', () => {
    let source = 'class A {} A;'
    let expected = 'class A {\n}\nA;'
    expect(print(source)).toEqual(expected)
  })

  test('A; class A {}', () => {
    let source = 'A; class A {}'
    let expected = 'A;\nclass A {\n}'
    expect(print(source)).toEqual(expected)
  })

  test('class A { var b; fun c() => b; }', () => {
    let source = 'class A { var b; fun c() => b }'
    let expected = `
class A {
  public $b;
  function c() {
    return $this->b;
  }
}
    `.trim()
    expect(print(source)).toEqual(expected)
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
