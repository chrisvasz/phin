// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';

function ast(source: string) {
  return parse(scan(source));
}

describe('math', () => {
  test('1 + 2', () => {
    let source = '1 + 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral('1'),
          '+',
          new expr.NumberLiteral('2'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('1 + 2 * 3', () => {
    let source = '1 + 2 * 3';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral('1'),
          '+',
          new expr.Binary(
            new expr.NumberLiteral('2'),
            '*',
            new expr.NumberLiteral('3'),
          ),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('1 * 2 - 3', () => {
    let source = '1 * 2 - 3';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.Binary(
            new expr.NumberLiteral('1'),
            '*',
            new expr.NumberLiteral('2'),
          ),
          '-',
          new expr.NumberLiteral('3'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('1 + 2 + 3', () => {
    let source = '1 + 2 + 3';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.Binary(
            new expr.NumberLiteral('1'),
            '+',
            new expr.NumberLiteral('2'),
          ),
          '+',
          new expr.NumberLiteral('3'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('1 + (2 + 3)', () => {
    let source = '1 + (2 + 3)';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral('1'),
          '+',
          new expr.Grouping(
            new expr.Binary(
              new expr.NumberLiteral('2'),
              '+',
              new expr.NumberLiteral('3'),
            ),
          ),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('1 / 2', () => {
    let source = '1 / 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral('1'),
          '/',
          new expr.NumberLiteral('2'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('expr() / expr()', () => {
    let source = 'expr() / expr()';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.Call(new expr.Identifier('expr'), []),
          '/',
          new expr.Call(new expr.Identifier('expr'), []),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});

describe('unary operators', () => {
  test('!true', () => {
    let source = '!true';
    let expected = [
      new stmt.Expression(new expr.Unary('!', new expr.BooleanLiteral(true))),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('-1', () => {
    let source = '-1';
    let expected = [
      new stmt.Expression(new expr.Unary('-', new expr.NumberLiteral('1'))),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('+1', () => {
    let source = '+1';
    let expected = [
      new stmt.Expression(new expr.Unary('+', new expr.NumberLiteral('1'))),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('!!true', () => {
    let source = '!!true';
    let expected = [
      new stmt.Expression(
        new expr.Unary('!', new expr.Unary('!', new expr.BooleanLiteral(true))),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test.todo('i++');
  test.todo('i--');
});

describe('prefix operators', () => {
  test('++i', () => {
    let source = '++i';
    let expected = [
      new stmt.Expression(new expr.Prefix('++', new expr.Identifier('i'))),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('--i', () => {
    let source = '--i';
    let expected = [
      new stmt.Expression(new expr.Prefix('--', new expr.Identifier('i'))),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('++x + !x', () => {
    let source = '++x + !x';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.Prefix('++', new expr.Identifier('x')),
          '+',
          new expr.Unary('!', new expr.Identifier('x')),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('!++x', () => {
    let source = '!++x';
    let expected = [
      new stmt.Expression(
        new expr.Unary('!', new expr.Prefix('++', new expr.Identifier('x'))),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});

describe('binary operators', () => {
  test('1 > 2', () => {
    let source = '1 > 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral('1'),
          '>',
          new expr.NumberLiteral('2'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('1 >= 2', () => {
    let source = '1 >= 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral('1'),
          '>=',
          new expr.NumberLiteral('2'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('1 < 2', () => {
    let source = '1 < 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral('1'),
          '<',
          new expr.NumberLiteral('2'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('1 <= 2', () => {
    let source = '1 <= 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral('1'),
          '<=',
          new expr.NumberLiteral('2'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('1 == 2', () => {
    let source = '1 == 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral('1'),
          '==',
          new expr.NumberLiteral('2'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('1 === 2', () => {
    let source = '1 === 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral('1'),
          '===',
          new expr.NumberLiteral('2'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('1 != 2', () => {
    let source = '1 != 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral('1'),
          '!=',
          new expr.NumberLiteral('2'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('1 !== 2', () => {
    let source = '1 !== 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral('1'),
          '!==',
          new expr.NumberLiteral('2'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('1 <=> 2', () => {
    let source = '1 <=> 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral('1'),
          '<=>',
          new expr.NumberLiteral('2'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('1 && 2', () => {
    let source = '1 && 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral('1'),
          '&&',
          new expr.NumberLiteral('2'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });

  test('1 || 2', () => {
    let source = '1 || 2';
    let expected = [
      new stmt.Expression(
        new expr.Binary(
          new expr.NumberLiteral('1'),
          '||',
          new expr.NumberLiteral('2'),
        ),
      ),
    ];
    expect(ast(source)).toEqual(expected);
  });
});

describe('terminators', () => {
  test('1;2', () => {
    let source = '1;2';
    let expected = [
      new stmt.Expression(new expr.NumberLiteral('1')),
      new stmt.Expression(new expr.NumberLiteral('2')),
    ];
    expect(ast(source)).toEqual(expected);
  });
});
