// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import { PhpPrinter, PrintError } from './print'

function print(src: string) {
  let result = new PhpPrinter().print(parse(scan(src)))
  return result.trim()
}

function trimMargin(s: string) {
  if (s[0] === '\n') s = s.slice(1)
  let leading = 0
  while (s[leading] === ' ') {
    leading++
  }
  const replace = '\n' + ' '.repeat(leading)
  return s
    .slice(leading - 1)
    .replaceAll(replace, '\n')
    .trim()
}

test('trimMargin', () => {
  let s = `
    class A {
      function a() {}
    }
  `
  let expected = 'class A {\n  function a() {}\n}'
  expect(trimMargin(s)).toEqual(expected)
})

describe('print class declaration', () => {
  test('class A {}', () => {
    let source = 'class A {}'
    let expected = 'class A {}'
    expect(print(source)).toEqual(expected)
  })
})

describe('print class params & constructor', () => {
  test('class A private() {}', () => {
    let source = 'class A private() {}'
    let expected = trimMargin(`
      class A {
        private function __construct() {}
      }
    `)
    expect(print(source)).toEqual(expected)
  })

  test('class A(a) {}', () => {
    let source = 'class A(a) {}'
    let expected = trimMargin(`
      class A {
        function __construct($a) {}
      }
    `)
    expect(print(source)).toEqual(expected)
  })

  test('class A(a) { fun b() => a }', () => {
    let source = 'class A(a) { fun b() => a }'
    expect(() => print(source)).toThrow(new PrintError('Unknown identifier a'))
  })

  test('class A(private a) { fun b() => a }', () => {
    let source = 'class A(private a) { fun b() => 1 }'
    let expected = trimMargin(`
      class A {
        function __construct(private $a) {}
        function b() {
          return 1;
        }
      }
    `)
    expect(print(source)).toEqual(expected)
  })

  test('class A(public a, final private readonly b) { fun b() => a }', () => {
    let source = 'class A(private a, final private readonly b) { fun b() => 1 }'
    let expected = trimMargin(`
      class A {
        function __construct(private $a, final private readonly $b) {}
        function b() {
          return 1;
        }
      }
    `)
    expect(print(source)).toEqual(expected)
  })
})

describe('print class properties', () => {
  test('class A { var a; }', () => {
    let source = 'class A { var a; }'
    let expected = trimMargin(`
      class A {
        public $a;
      }
    `)
    expect(print(source)).toEqual(expected)
  })

  test('class A { const B = 1; }', () => {
    let source = 'class A { const B = 1; }'
    let expected = trimMargin(`
      class A {
        const B = 1;
      }
    `)
    expect(print(source)).toEqual(expected)
  })
})

describe('print class methods', () => {
  test('class A { fun a() {} }', () => {
    let source = 'class A { fun a() {} }'
    let expected = trimMargin(`
      class A {
        function a() {}
      }
    `)
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
