// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { PhpPrinter, PrintError } from './print'
import { trimMargin } from './trimMargin'
import compile from '../compiler'

function ast(source: string) {
  return compile(source, { buildEnvironment: true })
}

function print(source: string) {
  let printer = new PhpPrinter()
  return printer.print(ast(source)).trim()
}

describe('print class declaration', () => {
  test('class A {}', () => {
    let source = 'class A {}'
    let expected = 'class A {\n}'
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

  test('class A protected() {}', () => {
    let source = 'class A protected() {}'
    let expected = trimMargin(`
      class A {
        protected function __construct() {}
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

  test('class A(a = 1) {}', () => {
    let source = 'class A(a = 1) {}'
    let expected = trimMargin(`
      class A {
        function __construct($a = 1) {}
      }
    `)
    expect(print(source)).toEqual(expected)
  })

  test('class A(var a) { fun b() => a }', () => {
    let source = 'class A(var a) { fun b() => 1 }'
    let expected = trimMargin(`
      class A {
        function __construct(public $a) {}
        function b() {
          return 1;
        }
      }
    `)
    expect(print(source)).toEqual(expected)
  })

  test('class A(public var a, final private var b) { fun b() => a }', () => {
    let source = 'class A(public var a, final private var b) { fun b() => a }'
    let expected = trimMargin(`
      class A {
        function __construct(public $a, final private $b) {}
        function b() {
          return $this->a;
        }
      }
    `)
    expect(print(source)).toEqual(expected)
  })

  test('class A(val a) {}', () => {
    let source = 'class A(val a) {}'
    let expected = trimMargin(`
      class A {
        function __construct(public readonly $a) {}
      }
    `)
    expect(print(source)).toEqual(expected)
  })

  test('class A(var a: array) {}', () => {
    let source = 'class A(var a: array) {}'
    let expected = trimMargin(`
      class A {
        function __construct(public array $a) {}
      }
    `)
    expect(print(source)).toEqual(expected)
  })

  test('class A(var a: array<int>) {}', () => {
    let source = 'class A(var a: array<int>) {}'
    let expected = trimMargin(`
      class A {
        /**
         * @param array<int> $a
         */
        function __construct(public array $a) {}
      }
    `)
    expect(print(source)).toEqual(expected)
  })
})

describe('print class initializers', () => {
  test.todo('class A { init { echo "hello world"; } }')
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

  test('class A { var a = 1; }', () => {
    let source = 'class A { var a = 1; }'
    let expected = trimMargin(`
      class A {
        function __construct() {
          $this->a = 1;
        }
        public $a;
      }
    `)
    expect(print(source)).toEqual(expected)
  })

  test.todo('class A(a) { var b = a; }', () => {
    let source = 'class A(a) { var b = a; }'
    let expected = trimMargin(`
      class A {
        function __construct($a) {
          $this->b = $a;
        }
        public $b;
      }
    `)
    expect(print(source)).toEqual(expected)
  })
})

describe('print class constants', () => {
  test('class A { const B = 1; }', () => {
    let source = 'class A { const B = 1; }'
    let expected = trimMargin(`
      class A {
        const B = 1;
      }
    `)
    expect(print(source)).toEqual(expected)
  })

  test('class A { const B = 1; fun a() => B }', () => {
    let source = 'class A { const B = 1; fun a() => B }'
    let expected = trimMargin(`
      class A {
        const B = 1;
        function a() {
          return self::B;
        }
      }
    `)
    expect(print(source)).toEqual(expected)
  })

  test('class A { const B = 1; fun a(B) => B }', () => {
    let source = 'class A { const B = 1; fun a(B) => B }'
    let expected = trimMargin(`
      class A {
        const B = 1;
        function a($B) {
          return $B;
        }
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

describe('print class implements', () => {
  test('class A implements B {}', () => {
    let source = 'class A implements B {}'
    let expected = 'class A implements B {\n}'
    expect(print(source)).toEqual(expected)
  })

  test('class A implements B, C {}', () => {
    let source = 'class A implements B, C {}'
    let expected = trimMargin(`
      class A implements B, C {\n}
    `)
    expect(print(source)).toEqual(expected)
  })
})

describe('print class extends', () => {
  test('class A extends B {}', () => {
    let source = 'class A extends B {}'
    let expected = 'class A extends B {\n}'
    expect(print(source)).toEqual(expected)
  })
})

describe('print class iterates', () => {
  test('class A(-var a) iterates a {}', () => {
    let source = 'class A(-var a) iterates a {}'
    let expected = trimMargin(`
      class A implements IteratorAggregate {
        function __construct(private $a) {}
        function getIterator(): Traversable {
          return new ArrayIterator($this->a);
        }
      }
    `)
    expect(print(source)).toEqual(expected)
  })

  test('class A iterates a { private var a; }', () => {
    let source = 'class A iterates a { private var a; }'
    let expected = trimMargin(`
      class A implements IteratorAggregate {
        function getIterator(): Traversable {
          return new ArrayIterator($this->a);
        }
        private $a;
      }
    `)
    expect(print(source)).toEqual(expected)
  })
})

describe('print abstract class', () => {
  test('abstract class A {}', () => {
    let source = 'abstract class A {}'
    let expected = 'abstract class A {\n}'
    expect(print(source)).toEqual(expected)
  })

  test('abstract class A { abstract fun a(); }', () => {
    let source = 'abstract class A { abstract fun a(); }'
    let expected = trimMargin(`
      abstract class A {
        abstract function a();
      }
    `)
    expect(print(source)).toEqual(expected)
  })
})

test('complex class', () => {
  let source = `
    class Rental(-val movie: Movie, -val daysRented: int) {
      val title: string = movie.title
      fun points(): int => movie.price.points(daysRented)
      fun amount(): float => movie.price.amount(daysRented)
    }
  `
  let expected = trimMargin(`
    class Rental {
      function __construct(private readonly Movie $movie, private readonly int $daysRented) {
        $this->title = $this->movie->title;
      }
      public readonly string $title;
      function points(): int {
        return $this->movie->price->points($this->daysRented);
      }
      function amount(): float {
        return $this->movie->price->amount($this->daysRented);
      }
    }
  `)
  expect(print(source)).toEqual(expected)
})
