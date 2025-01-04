// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../../scanner'
import parse from '../parser'
import { b, t } from '../parser.builder'
import { Environment, EnvironmentKind } from '../environment'
import * as nodes from '../nodes'

function ast(source: string) {
  return parse(scan(source), { buildEnvironment: true })
}

const { Variable, Function } = EnvironmentKind

describe('environment: global variables', () => {
  test('var a;', () => {
    let source = 'var a;'
    let expected = new nodes.Program(
      [b.var('a')],
      new Environment(null, { a: Variable }),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('var a; var b;', () => {
    let source = 'var a; var b;'
    let expected = new nodes.Program(
      [b.var('a'), b.var('b')],
      new Environment(null, { a: Variable, b: Variable }),
    )
    expect(ast(source)).toEqual(expected)
  })
})

describe('environment: functions', () => {
  test('fun a() {} fun b() {}', () => {
    let source = 'fun a() {} fun b() {}'
    let globals = new Environment(null)
    globals.add('a', Function)
    globals.add('b', Function)
    let expected = new nodes.Program(
      [
        b.fun('a', { env: new Environment(globals) }),
        b.fun('b', { env: new Environment(globals) }),
      ],
      globals,
    )
    expect(ast(source)).toEqual(expected)
  })

  test('fun a() { var b; } fun b() {}', () => {
    let source = 'fun a() { var b; } fun b() {}'
    let globals = new Environment(null)
    globals.add('a', Function)
    globals.add('b', Function)
    let expected = new nodes.Program(
      [
        b.fun('a', {
          env: new Environment(globals, { b: Variable }),
          body: b.block(b.var('b')),
        }),
        b.fun('b', { env: new Environment(globals) }),
      ],
      globals,
    )
    expect(ast(source)).toEqual(expected)
  })
})
