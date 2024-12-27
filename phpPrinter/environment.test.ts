// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { Environment, Kind } from './environment'

describe('environment', () => {
  test('blank', () => {
    let env = new Environment(null)
    expect(env.get('a')).toEqual(null)
  })

  test('resolve from enclosing scope', () => {
    let top = new Environment(null)
    top.add('a', Kind.Class)
    let bottom = new Environment(top)
    expect(bottom.get('a')).toEqual(Kind.Class)
  })

  test('resolve from deepest scope first', () => {
    let top = new Environment(null)
    top.add('a', Kind.Function)
    let bottom = new Environment(top)
    bottom.add('a', Kind.Class)
    expect(bottom.get('a')).toEqual(Kind.Class)
  })

  test('only resolve variables from bottom scope', () => {
    let top = new Environment(null)
    top.add('a', Kind.Function)
    let middle = new Environment(top)
    middle.add('a', Kind.Variable)
    let bottom = new Environment(top)
    expect(bottom.get('a')).toEqual(Kind.Function)
  })

  test('redeclaration overrides', () => {
    let env = new Environment(null)
    env.add('a', Kind.Variable)
    env.add('a', Kind.Function)
    expect(env.get('a')).toEqual(Kind.Function)
  })
})
