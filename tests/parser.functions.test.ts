// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import * as nodes from '../nodes'
import * as types from '../types'

function ast(source: string) {
  return parse(scan(source))
}

function block(...statements: nodes.Stmt[]) {
  return new nodes.Block(statements)
}

describe('call expressions', () => {
  test('thing()', () => {
    let source = 'thing()'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.Call(new nodes.Identifier('thing'), []),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('thing(1)', () => {
    let source = 'thing(1)'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.Call(new nodes.Identifier('thing'), [
          new nodes.NumberLiteral('1'),
        ]),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('thing(1, 2)', () => {
    let source = 'thing(1, 2)'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.Call(new nodes.Identifier('thing'), [
          new nodes.NumberLiteral('1'),
          new nodes.NumberLiteral('2'),
        ]),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('thing(1 + 2, 3 - 4)', () => {
    let source = 'thing(1 + 2, 3 - 4)'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.Call(new nodes.Identifier('thing'), [
          new nodes.Binary(
            new nodes.NumberLiteral('1'),
            '+',
            new nodes.NumberLiteral('2'),
          ),
          new nodes.Binary(
            new nodes.NumberLiteral('3'),
            '-',
            new nodes.NumberLiteral('4'),
          ),
        ]),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('thing(thing2())', () => {
    let source = 'thing(thing2())'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.Call(new nodes.Identifier('thing'), [
          new nodes.Call(new nodes.Identifier('thing2'), []),
        ]),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('thing(1,)', () => {
    let source = 'thing(1,)'
    let expected = [
      new nodes.ExpressionStatement(
        new nodes.Call(new nodes.Identifier('thing'), [
          new nodes.NumberLiteral('1'),
        ]),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })
})

describe('function declarations', () => {
  test('fun foo() {}', () => {
    let source = 'fun foo() {}'
    let expected = [new nodes.FunctionDeclaration('foo', [], null, block())]
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo(a) {}', () => {
    let source = 'fun foo(a) {}'
    let expected = [
      new nodes.FunctionDeclaration(
        'foo',
        [new nodes.Param('a', null, null)],
        null,
        block(),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo(a: array<number>, b: string,) {}', () => {
    let source = 'fun foo(a: array<number>, b: string,) {}'
    let expected = [
      new nodes.FunctionDeclaration(
        'foo',
        [
          new nodes.Param(
            'a',
            new types.Identifier('array', [new types.Number()]),
            null,
          ),
          new nodes.Param('b', new types.String(), null),
        ],
        null,
        block(),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo(): array<number> {}', () => {
    let source = 'fun foo(): array<number> {}'
    let expected = [
      new nodes.FunctionDeclaration(
        'foo',
        [],
        new types.Identifier('array', [new types.Number()]),
        block(),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo() {2;3;}', () => {
    let source = 'fun foo() {2;3;}'
    let expected = [
      new nodes.FunctionDeclaration(
        'foo',
        [],
        null,
        block(
          new nodes.ExpressionStatement(new nodes.NumberLiteral('2')),
          new nodes.ExpressionStatement(new nodes.NumberLiteral('3')),
        ),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo(a: number = 1) {}', () => {
    let source = 'fun foo(a: number = 1) {}'
    let expected = [
      new nodes.FunctionDeclaration(
        'foo',
        [
          new nodes.Param(
            'a',
            new types.Number(),
            new nodes.NumberLiteral('1'),
          ),
        ],
        null,
        block(),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo() { return 1; }', () => {
    let source = 'fun foo() { return 1; }'
    let expected = [
      new nodes.FunctionDeclaration(
        'foo',
        [],
        null,
        block(new nodes.Return(new nodes.NumberLiteral('1'))),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo() { 3; return 1; }', () => {
    let source = 'fun foo() { 3; return 1; }'
    let expected = [
      new nodes.FunctionDeclaration(
        'foo',
        [],
        null,
        block(
          new nodes.ExpressionStatement(new nodes.NumberLiteral('3')),
          new nodes.Return(new nodes.NumberLiteral('1')),
        ),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo() { fun bar() {} }', () => {
    let source = 'fun foo() { fun bar() {} }'
    let expected = [
      new nodes.FunctionDeclaration(
        'foo',
        [],
        null,
        block(new nodes.FunctionDeclaration('bar', [], null, block())),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('fun foo() => thing();', () => {
    let source = 'fun foo() => thing();'
    let expected = [
      new nodes.FunctionDeclaration(
        'foo',
        [],
        null,
        new nodes.Call(new nodes.Identifier('thing'), []),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })
})

describe('function expressions', () => {
  test('var a = fun() {};', () => {
    let source = 'var a = fun() {};'
    let expected = [
      new nodes.VarDeclaration(
        'a',
        null,
        new nodes.FunctionExpression([], null, block()),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('var a = fun(): number => 1;', () => {
    let source = 'var a = fun(): number => 1;'
    let expected = [
      new nodes.VarDeclaration(
        'a',
        null,
        new nodes.FunctionExpression(
          [],
          new types.Number(),
          new nodes.NumberLiteral('1'),
        ),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('var a = fun(b: number|string = 4, c = 6,) { return 5; }', () => {
    let source = 'var a = fun(b: number|string = 4, c = 6) { return 5; }'
    let expected = [
      new nodes.VarDeclaration(
        'a',
        null,
        new nodes.FunctionExpression(
          [
            new nodes.Param(
              'b',
              new types.Union([new types.Number(), new types.String()]),
              new nodes.NumberLiteral('4'),
            ),
            new nodes.Param('c', null, new nodes.NumberLiteral('6')),
          ],
          null,
          block(new nodes.Return(new nodes.NumberLiteral('5'))),
        ),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })

  test('var a = fun(b) => fun(c) => b + c;', () => {
    let source = 'var a = fun(b) => fun(c) => b + c;'
    let expected = [
      new nodes.VarDeclaration(
        'a',
        null,
        new nodes.FunctionExpression(
          [new nodes.Param('b', null, null)],
          null,
          new nodes.FunctionExpression(
            [new nodes.Param('c', null, null)],
            null,
            new nodes.Binary(
              new nodes.Identifier('b'),
              '+',
              new nodes.Identifier('c'),
            ),
          ),
        ),
      ),
    ]
    expect(ast(source)).toEqual(expected)
  })
})
