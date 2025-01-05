// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../../scanner'
import parse from '../parser'
import { b, t } from '../parser.builder'
import {
  ClassEnvironment,
  EnvironmentKind,
  HoistedEnvironment,
} from '../environment'
import * as nodes from '../../nodes'
import ParseError from '../ParseError'

function ast(source: string) {
  return parse(scan(source), { buildEnvironment: true })
}

const { Variable, Function, Class, ClassConst, ClassMethod, ClassProperty } =
  EnvironmentKind

describe('environment: hoisting', () => {
  test('fun a() { fun b() {} }', () => {
    let source = 'fun a() { fun b() {} }'
    let globals = new HoistedEnvironment(null)
    globals.add('a', Function)
    globals.add('b', Function)
    let expected = new nodes.Program(
      [b.fun('a', { body: b.block(b.fun('b')) })],
      globals,
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A {} class B {}', () => {
    let source = 'class A {} class B {} fun c() {}'
    let globals = new HoistedEnvironment(null)
    globals.add('A', Class)
    globals.add('B', Class)
    globals.add('c', Function)
    let expected = new nodes.Program(
      [
        b.class('A', { env: new ClassEnvironment(globals) }),
        b.class('B', { env: new ClassEnvironment(globals) }),
        b.fun('c'),
      ],
      globals,
    )
    expect(ast(source)).toEqual(expected)
  })
})

describe('environment: classes', () => {
  test('class A {}', () => {
    let source = 'class A {}'
    let globals = new HoistedEnvironment(null, { A: Class })
    let expected = new nodes.Program(
      [b.class('A', { env: new ClassEnvironment(globals) })],
      globals,
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A { var b; }', () => {
    let source = 'class A { var b; }'
    let globals = new HoistedEnvironment(null, { A: Class })
    let expected = new nodes.Program(
      [
        b.class('A', {
          env: new ClassEnvironment(globals, { b: ClassProperty }),
          members: [b.classProperty('b')],
        }),
      ],
      globals,
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A(var b) {}', () => {
    let source = 'class A(var b) {}'
    let globals = new HoistedEnvironment(null, { A: Class })
    let expected = new nodes.Program(
      [
        b.class('A', {
          env: new ClassEnvironment(globals, { b: ClassProperty }),
          params: [b.classProperty('b')],
        }),
      ],
      globals,
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A { fun b() {} }', () => {
    let source = 'class A { fun b() {} }'
    let globals = new HoistedEnvironment(null, { A: Class })
    let expected = new nodes.Program(
      [
        b.class('A', {
          env: new ClassEnvironment(globals, { b: ClassMethod }),
          members: [b.classMethod('b')],
        }),
      ],
      globals,
    )
    expect(ast(source)).toEqual(expected)
  })

  test('class A { const b = 3 }', () => {
    let source = 'class A { const b = 3 }'
    let globals = new HoistedEnvironment(null, { A: Class })
    let expected = new nodes.Program(
      [
        b.class('A', {
          env: new ClassEnvironment(globals, { b: ClassConst }),
          members: [b.classConst('b', b.numberLiteral(3))],
        }),
      ],
      globals,
    )
    expect(ast(source)).toEqual(expected)
  })
})
