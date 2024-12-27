// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import { PhpPrinter } from './print'

function print(src: string) {
  let result = new PhpPrinter().print(parse(scan(src)))
  return result.trim()
}

describe('print class declaration', () => {
  test('class A {}', () => {
    let source = 'class A {}'
    let expected = 'class A {}'
    expect(print(source)).toEqual(expected)
  })

  test.only('class A(a) {}', () => {
    let source = 'class A(a) {}'
    let expected = `
class A {
public function __construct(private readonly $a) {}
}
    `.trim()
    expect(print(source)).toEqual(expected)
  })

  test.todo('private constructor')
})

describe('print class properties', () => {
  test('class A { var a; }', () => {
    let source = 'class A { var a; }'
    let expected = `
class A {
$a;
}
      `.trim()
    expect(print(source)).toEqual(expected)
  })
})

describe('print class methods', () => {
  test('class A { fun a() {} }', () => {
    let source = 'class A { fun a() {} }'
    let expected = `

class A {
function a() {}
}
      `.trim()
    expect(print(source)).toEqual(expected)
  })
})

describe('print this/super', () => {
  test('this', () => {
    let source = 'this'
    let expected = '$this;'
    expect(print(source)).toEqual(expected)
  })

  test('super', () => {
    let source = 'super'
    let expected = 'super;'
    expect(print(source)).toEqual(expected)
  })
})
