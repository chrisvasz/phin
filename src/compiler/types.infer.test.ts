// @ts-ignore
import { expect, test, describe } from 'bun:test'
import * as n from '../nodes'
import * as types from '../types'
import compile from './compiler'
import VoidVisitor from './VoidVisitor'
import { t } from '../builder'

describe('type inference: var declarations without explicit annotations', () => {
  function check(ast: n.Program, name: string, expected: types.Type) {
    let calls = 0
    let visitor = new (class extends VoidVisitor {
      override visitVarDeclaration(node: n.VarDeclaration): void {
        if (node.name !== name) return
        calls++
        expect(node.type?.equals(expected)).toBe(true)
      }
    })()
    visitor.visitProgram(ast)
    expect(calls).toBe(1)
  }

  test('var a = null', () => {
    let src = 'var a = null'
    check(compile(src), 'a', t.null())
  })

  test('var a = ""', () => {
    let src = 'var a = ""'
    check(compile(src), 'a', t.string())
  })

  test('var a = true', () => {
    let src = 'var a = true'
    check(compile(src), 'a', t.true())
  })

  test('var a = false', () => {
    let src = 'var a = false'
    check(compile(src), 'a', t.false())
  })
})

describe('type inference: shorthand function return type', () => {
  function check(ast: n.Program, expected: types.Type) {
    let calls = 0
    let visitor = new (class extends VoidVisitor {
      override visitFunctionDeclaration(node: n.FunctionDeclaration): void {
        calls++
        expect(node.type?.equals(expected)).toBe(true)
      }
    })()
    visitor.visitProgram(ast)
    expect(calls).toBe(1)
  }

  test('fun a() => null', () => {
    let src = 'fun a() => null'
    check(compile(src), t.fun([], t.null()))
  })

  test('fun a() => !true', () => {
    let src = 'fun a() => !true'
    check(compile(src), t.fun([], t.bool()))
  })
})

describe('type inference: function param', () => {
  function check(ast: n.Program, expected: types.Type) {
    let calls = 0
    let visitor = new (class extends VoidVisitor {
      override visitParam(node: n.Param): void {
        calls++
        expect(node.type?.equals(expected)).toBe(true)
      }
    })()
    visitor.visitProgram(ast)
    expect(calls).toBe(1)
  }

  test('fun a(b: string) => null', () => {
    let src = 'fun a(b: string) => null'
    check(compile(src), t.string())
  })

  test('fun a(b = "") => null', () => {
    let src = 'fun a(b = "") => null'
    check(compile(src), t.string())
  })
})

describe('type inference: classes', () => {
  describe('class param', () => {
    function check(ast: n.Program, expected: types.Type) {
      let calls = 0
      let visitor = new (class extends VoidVisitor {
        override visitParam(node: n.Param): void {
          calls++
          expect(node.type?.equals(expected)).toBe(true)
        }
      })()
      visitor.visitProgram(ast)
      expect(calls).toBe(1)
    }

    test('class A(b: string) {}', () => {
      let src = 'class A(b: string) {}'
      check(compile(src), t.string())
    })

    test('class A(b = "") {}', () => {
      let src = 'class A(b = "") {}'
      check(compile(src), t.string())
    })
  })

  describe('class constructor promoted property', () => {
    function check(ast: n.Program, expected: types.Type) {
      let calls = 0
      let visitor = new (class extends VoidVisitor {
        override visitClassProperty(node: n.ClassProperty): void {
          calls++
          expect(node.type?.equals(expected)).toBe(true)
        }
      })()
      visitor.visitProgram(ast)
      expect(calls).toBe(1)
    }

    test('class A(val b: string) {}', () => {
      let src = 'class A(val b: string) {}'
      check(compile(src), t.string())
    })

    test('class A(val b = true) {}', () => {
      let src = 'class A(val b = true) {}'
      check(compile(src), t.true())
    })

    test('class A(var b: string) {}', () => {
      let src = 'class A(var b: string) {}'
      check(compile(src), t.string())
    })

    test('class A(var b = true) {}', () => {
      let src = 'class A(var b = true) {}'
      check(compile(src), t.true())
    })
  })

  describe('class const', () => {
    function check(ast: n.Program, expected: types.Type) {
      let calls = 0
      let visitor = new (class extends VoidVisitor {
        override visitClassConst(node: n.ClassConst): void {
          calls++
          expect(node.type?.equals(expected)).toBe(true)
        }
      })()
      visitor.visitProgram(ast)
      expect(calls).toBe(1)
    }

    test('class A { const a = ""; }', () => {
      let src = 'class A { const a = ""; }'
      check(compile(src), t.string())
    })

    test('class A { const a = !true; }', () => {
      let src = 'class A { const a = !true; }'
      check(compile(src), t.bool())
    })
  })

  describe('class method shorthand return', () => {
    function check(ast: n.Program, expected: types.Type) {
      let calls = 0
      let visitor = new (class extends VoidVisitor {
        override visitClassMethod(node: n.ClassMethod): void {
          calls++
          expect(node.type?.equals(expected)).toBe(true)
        }
      })()
      visitor.visitProgram(ast)
      expect(calls).toBe(1)
    }

    test('class A { fun a() => null }', () => {
      let src = 'class A { fun a() => null }'
      check(compile(src), t.fun([], t.null()))
    })

    test('class A { fun a() => !true }', () => {
      let src = 'class A { fun a() => !true }'
      check(compile(src), t.fun([], t.bool()))
    })
  })

  describe('class method param', () => {
    function check(ast: n.Program, expected: types.Type) {
      let calls = 0
      let visitor = new (class extends VoidVisitor {
        override visitParam(node: n.Param): void {
          calls++
          expect(node.type?.equals(expected)).toBe(true)
        }
      })()
      visitor.visitProgram(ast)
      expect(calls).toBe(1)
    }

    test('class A { fun a(b: string) => null }', () => {
      let src = 'class A { fun a(b: string) => null }'
      check(compile(src), t.string())
    })

    test('class A { fun a(b = "") => null }', () => {
      let src = 'class A { fun a(b = "") => null }'
      check(compile(src), t.string())
    })
  })

  describe('class property', () => {
    function check(ast: n.Program, expected: types.Type) {
      let calls = 0
      let visitor = new (class extends VoidVisitor {
        override visitClassProperty(node: n.ClassProperty): void {
          calls++
          expect(node.type?.equals(expected)).toBe(true)
        }
      })()
      visitor.visitProgram(ast)
      expect(calls).toBe(1)
    }

    test('class A { val b = true; }', () => {
      let src = 'class A { val b = true; }'
      check(compile(src), t.true())
    })

    test('class A { val b: string; }', () => {
      let src = 'class A { val b: string; }'
      check(compile(src), t.string())
    })
  })
})

describe('type inference: identifiers', () => {
  function check(ast: n.Program, expected: types.Type, name: string = 'a') {
    let calls = 0
    let visitor = new (class extends VoidVisitor {
      override visitIdentifier(node: n.Identifier): void {
        if (node.name !== name) return
        calls++
        expect(node.type?.equals(expected)).toBe(true)
      }
    })()
    visitor.visitProgram(ast)
    expect(calls).toBe(1)
  }

  test('var a = ""; a', () => {
    let src = 'var a = ""; a'
    check(compile(src), t.string())
  })

  test('var a = true; var b = a; b', () => {
    let src = 'var a = true; var b = a; b'
    check(compile(src), t.true(), 'b')
  })

  test('var a = true; var b = a +. 3; b', () => {
    let src = 'var a = ""; var b = a; b'
    check(compile(src), t.string(), 'b')
  })

  test('fun a() => ""; a', () => {
    let src = 'fun a() => ""; a'
    check(compile(src), t.fun([], t.string()))
  })

  test('fun b(a: string) => a;', () => {
    let src = 'fun b(a: string) => a;'
    check(compile(src), t.string())
  })

  test('class A { fun a() => null; fun b() => a }', () => {
    let src = 'class A { fun a() => null; fun b() => a }'
    check(compile(src), t.fun([], t.null()))
  })

  test('class A { const a = ""; fun b() => a }', () => {
    let src = 'class A { const a = ""; fun b() => a }'
    check(compile(src), t.string())
  })

  test('class A { val a = ""; fun b() => a }', () => {
    let src = 'class A { val a = ""; fun b() => a }'
    check(compile(src), t.string())
  })
})
