// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../../scanner'
import parse from '../parser'
import { b } from '../../builder'

function ast(source: string) {
  return parse(scan(source))
}

describe('parse if statements', () => {
  test('if (true) 2', () => {
    let source = 'if (true) 2'
    let expected = b.program(
      b.if(b.true(), b.expressionStatement(b.intLiteral('2')), null),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('if (true) {2;"5";}', () => {
    let source = 'if (true) {2;"5";}'
    let expected = b.program(
      b.if(
        b.true(),
        b.block(
          b.expressionStatement(b.intLiteral('2')),
          b.expressionStatement(b.stringLiteral('5')),
        ),
        null,
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('if (true) 2 else 3', () => {
    let source = 'if (true) 2 else 3'
    let expected = b.program(
      b.if(
        b.true(),
        b.expressionStatement(b.intLiteral('2')),
        b.expressionStatement(b.intLiteral('3')),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('if (true) 2 else {5;}', () => {
    let source = 'if (true) 2 else {5;}'
    let expected = b.program(
      b.if(
        b.true(),
        b.expressionStatement(b.intLiteral('2')),
        b.block(b.expressionStatement(b.intLiteral('5'))),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('if (true) 2 else if (false) 5;', () => {
    let source = 'if (true) 2 else if (false) 5;'
    let expected = b.program(
      b.if(
        b.true(),
        b.expressionStatement(b.intLiteral('2')),
        b.if(b.false(), b.expressionStatement(b.intLiteral('5')), null),
      ),
    )
    expect(ast(source)).toEqual(expected)
  })

  test('if (a()) 1;', () => {
    let source = 'if (a()) 1;'
    let expected = b.program(
      b.if(b.call(b.id('a')), b.expressionStatement(b.intLiteral('1')), null),
    )
    expect(ast(source)).toEqual(expected)
  })
})
