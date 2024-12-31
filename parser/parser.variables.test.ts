// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import * as nodes from '../nodes'
import * as type from '../types'

function ast(source: string) {
  return parse(scan(source))
}

const identifier = (name: string) => new nodes.Identifier(name)
const var_ = (
  name: string | string[],
  type: type.Type | null = null,
  initializer: nodes.Expr | null = null,
) => new nodes.VarDeclaration(name, type, initializer)
const number = (value: string) => new nodes.NumberLiteral(value)
const string = (value: string) => new nodes.StringLiteral(value)

describe('parse var declarations', () => {
  test('var x', () => {
    let source = 'var x'
    let expected = [var_('x', null, null)]
    expect(ast(source)).toEqual(expected)
  })

  test('var x = 3', () => {
    let source = 'var x = 3'
    let expected = [var_('x', null, number('3'))]
    expect(ast(source)).toEqual(expected)
  })

  test('var x = 3 + 1', () => {
    let source = 'var x = 3 + 1'
    let expected = [
      var_('x', null, new nodes.Binary(number('3'), '+', number('1'))),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('var x = 3 + 1; var y; var z = "hello"', () => {
    let source = 'var x = 3 + 1; var y; var z = "hello"'
    let expected = [
      var_('x', null, new nodes.Binary(number('3'), '+', number('1'))),
      var_('y', null, null),
      var_('z', null, string('hello')),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: number', () => {
    let source = 'var x: number'
    let expected = [var_('x', new type.Number(), null)]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: number = 3', () => {
    let source = 'var x: number = 3'
    let expected = [var_('x', new type.Number(), number('3'))]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: string', () => {
    let source = 'var x: string'
    let expected = [var_('x', new type.String(), null)]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: bool', () => {
    let source = 'var x: bool'
    let expected = [var_('x', new type.Boolean(), null)]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: null', () => {
    let source = 'var x: null'
    let expected = [var_('x', new type.Null(), null)]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: int', () => {
    let source = 'var x: int'
    let expected = [var_('x', new type.Int(), null)]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: float', () => {
    let source = 'var x: float'
    let expected = [var_('x', new type.Float(), null)]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: 5', () => {
    let source = 'var x: 5'
    let expected = [var_('x', new type.NumberLiteral('5'), null)]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: "hello"', () => {
    let source = 'var x: "hello"'
    let expected = [var_('x', new type.StringLiteral('hello'), null)]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: Class', () => {
    let source = 'var x: Class'
    let expected = [var_('x', new type.Identifier('Class', []), null)]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: true', () => {
    let source = 'var x: true'
    let expected = [var_('x', new type.True(), null)]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: false', () => {
    let source = 'var x: false'
    let expected = [var_('x', new type.False(), null)]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array', () => {
    let source = 'var x: array'
    let expected = [var_('x', new type.Identifier('array', []), null)]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array<number>', () => {
    let source = 'var x: array<number>'
    let expected = [
      var_('x', new type.Identifier('array', [new type.Number()]), null),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array<array<array<number>>>', () => {
    let source = 'var x: array<array<array<number>>>'
    let expected = [
      var_(
        'x',
        new type.Identifier('array', [
          new type.Identifier('array', [
            new type.Identifier('array', [new type.Number()]),
          ]),
        ]),
        null,
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array<number|string>', () => {
    let source = 'var x: array<number|string>'
    let expected = [
      var_(
        'x',
        new type.Identifier('array', [
          new type.Union([new type.Number(), new type.String()]),
        ]),
        null,
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array<string,number>', () => {
    let source = 'var x: array<string,number>'
    let expected = [
      var_(
        'x',
        new type.Identifier('array', [new type.String(), new type.Number()]),
        null,
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array<string,>', () => {
    let source = 'var x: array<string,>'
    let expected = [
      var_('x', new type.Identifier('array', [new type.String()]), null),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: array<string|number,number&null,?5>', () => {
    let source = 'var x: array<string|number,number&null,?5>'
    let expected = [
      var_(
        'x',
        new type.Identifier('array', [
          new type.Union([new type.String(), new type.Number()]),
          new type.Intersection([new type.Number(), new type.Null()]),
          new type.Nullable(new type.NumberLiteral('5')),
        ]),
        null,
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: ?number', () => {
    let source = 'var x: ?number'
    let expected = [var_('x', new type.Nullable(new type.Number()), null)]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: string|number', () => {
    let source = 'var x: string|number'
    let expected = [
      var_('x', new type.Union([new type.String(), new type.Number()]), null),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: string|number|null', () => {
    let source = 'var x: string|number|null'
    let expected = [
      var_(
        'x',
        new type.Union([new type.String(), new type.Number(), new type.Null()]),
        null,
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: string&number', () => {
    let source = 'var x: string&number'
    let expected = [
      var_(
        'x',
        new type.Intersection([new type.String(), new type.Number()]),
        null,
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('var x: string&number&null', () => {
    let source = 'var x: string&number&null'
    let expected = [
      var_(
        'x',
        new type.Intersection([
          new type.String(),
          new type.Number(),
          new type.Null(),
        ]),
        null,
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test.todo('val declarations')
})

describe('parse destructuring assignment', () => {
  test('var [x] = b', () => {
    let source = 'var [x] = b'
    let expected = [var_(['x'], null, identifier('b'))]
    expect(ast(source)).toEqual(expected)
  })

  test('var [x,] = b', () => {
    let source = 'var [x,] = b'
    let expected = [var_(['x'], null, identifier('b'))]
    expect(ast(source)).toEqual(expected)
  })

  test('var [x,y,z] = b', () => {
    let source = 'var [x,y,z] = b'
    let expected = [var_(['x', 'y', 'z'], null, identifier('b'))]
    expect(ast(source)).toEqual(expected)
  })
})
