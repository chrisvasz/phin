// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from './Scanner';
import parse from './parser';
import { Block, Echo, Expression, If, Var } from './stmt';
import * as expr from './expr';
import * as type from './type';
import { Token, TokenType } from './Token';

describe('literals', () => {
  test('null', () => {
    let source = 'null';
    let expected = [new Expression(new expr.NullLiteral())];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('true', () => {
    let source = 'true';
    let expected = [new Expression(new expr.BooleanLiteral(true))];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('false', () => {
    let source = 'false';
    let expected = [new Expression(new expr.BooleanLiteral(false))];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('123', () => {
    let source = '123';
    let expected = [new Expression(new expr.NumberLiteral(123))];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('"hello"', () => {
    let source = '"hello"';
    let expected = [new Expression(new expr.StringLiteral('hello'))];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});

describe('math', () => {
  test('1 + 2', () => {
    let source = '1 + 2';
    let expected = [
      new Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.PLUS, '+', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 + 2 * 3', () => {
    let source = '1 + 2 * 3';
    let expected = [
      new Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.PLUS, '+', undefined, 1),
          new expr.Binary(
            new expr.NumberLiteral(2),
            new Token(TokenType.STAR, '*', undefined, 1),
            new expr.NumberLiteral(3),
          ),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 * 2 + 3', () => {
    let source = '1 * 2 + 3';
    let expected = [
      new Expression(
        new expr.Binary(
          new expr.Binary(
            new expr.NumberLiteral(1),
            new Token(TokenType.STAR, '*', undefined, 1),
            new expr.NumberLiteral(2),
          ),
          new Token(TokenType.PLUS, '+', undefined, 1),
          new expr.NumberLiteral(3),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 + 2 + 3', () => {
    let source = '1 + 2 + 3';
    let expected = [
      new Expression(
        new expr.Binary(
          new expr.Binary(
            new expr.NumberLiteral(1),
            new Token(TokenType.PLUS, '+', undefined, 1),
            new expr.NumberLiteral(2),
          ),
          new Token(TokenType.PLUS, '+', undefined, 1),
          new expr.NumberLiteral(3),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 + (2 + 3)', () => {
    let source = '1 + (2 + 3)';
    let expected = [
      new Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.PLUS, '+', undefined, 1),
          new expr.Grouping(
            new expr.Binary(
              new expr.NumberLiteral(2),
              new Token(TokenType.PLUS, '+', undefined, 1),
              new expr.NumberLiteral(3),
            ),
          ),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});

describe('binary operators', () => {
  test('1 > 2', () => {
    let source = '1 > 2';
    let expected = [
      new Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.GREATER, '>', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 >= 2', () => {
    let source = '1 >= 2';
    let expected = [
      new Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.GREATER_EQUAL, '>=', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 < 2', () => {
    let source = '1 < 2';
    let expected = [
      new Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.LESS, '<', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 <= 2', () => {
    let source = '1 <= 2';
    let expected = [
      new Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.LESS_EQUAL, '<=', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 == 2', () => {
    let source = '1 == 2';
    let expected = [
      new Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.EQUAL_EQUAL, '==', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('1 != 2', () => {
    let source = '1 != 2';
    let expected = [
      new Expression(
        new expr.Binary(
          new expr.NumberLiteral(1),
          new Token(TokenType.BANG_EQUAL, '!=', undefined, 1),
          new expr.NumberLiteral(2),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});

describe('terminators', () => {
  test('1;2', () => {
    let source = '1;2';
    let expected = [
      new Expression(new expr.NumberLiteral(1)),
      new Expression(new expr.NumberLiteral(2)),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test(`1\n2`, () => {
    let source = `1\n2`;
    let expected = [
      new Expression(new expr.NumberLiteral(1)),
      new Expression(new expr.NumberLiteral(2)),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});

describe('echo statements', () => {
  test('echo "hello"', () => {
    let source = 'echo "hello"';
    let expected = [new Echo(new expr.StringLiteral('hello'))];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});

describe('variable declarations', () => {
  test('var x', () => {
    let source = 'var x';
    let expected = [
      new Var(new Token(TokenType.IDENTIFIER, 'x', undefined, 1), null, null),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x = 3', () => {
    let source = 'var x = 3';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        null,
        new expr.NumberLiteral(3),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x = 3 + 1', () => {
    let source = 'var x = 3 + 1';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        null,
        new expr.Binary(
          new expr.NumberLiteral(3),
          new Token(TokenType.PLUS, '+', undefined, 1),
          new expr.NumberLiteral(1),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x = 3 + 1; var y; var z = "hello"', () => {
    let source = 'var x = 3 + 1; var y; var z = "hello"';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        null,
        new expr.Binary(
          new expr.NumberLiteral(3),
          new Token(TokenType.PLUS, '+', undefined, 1),
          new expr.NumberLiteral(1),
        ),
      ),
      new Var(new Token(TokenType.IDENTIFIER, 'y', undefined, 1), null, null),
      new Var(
        new Token(TokenType.IDENTIFIER, 'z', undefined, 1),
        null,
        new expr.StringLiteral('hello'),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: number', () => {
    let source = 'var x: number';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Number(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: number = 3', () => {
    let source = 'var x: number = 3';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Number(),
        new expr.NumberLiteral(3),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: string', () => {
    let source = 'var x: string';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.String(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: bool', () => {
    let source = 'var x: bool';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Boolean(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: null', () => {
    let source = 'var x: null';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Null(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: int', () => {
    let source = 'var x: int';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Int(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: float', () => {
    let source = 'var x: float';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Float(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: 5', () => {
    let source = 'var x: 5';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.NumberLiteral(5),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: "hello"', () => {
    let source = 'var x: "hello"';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.StringLiteral('hello'),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: Class', () => {
    let source = 'var x: Class';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Identifier('Class', []),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: true', () => {
    let source = 'var x: true';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.True(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: false', () => {
    let source = 'var x: false';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.False(),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: array', () => {
    let source = 'var x: array';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Identifier('array', []),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: array<number>', () => {
    let source = 'var x: array<number>';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Identifier('array', [new type.Number()]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: array<array<array<number>>>', () => {
    let source = 'var x: array<array<array<number>>>';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Identifier('array', [
          new type.Identifier('array', [
            new type.Identifier('array', [new type.Number()]),
          ]),
        ]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: array<number|string>', () => {
    let source = 'var x: array<number|string>';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Identifier('array', [
          new type.Union([new type.Number(), new type.String()]),
        ]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: array<string,number>', () => {
    let source = 'var x: array<string,number>';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Identifier('array', [new type.String(), new type.Number()]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: array<string|number,number&null,?5>', () => {
    let source = 'var x: array<string|number,number&null,?5>';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Identifier('array', [
          new type.Union([new type.String(), new type.Number()]),
          new type.Intersection([new type.Number(), new type.Null()]),
          new type.Nullable(new type.NumberLiteral(5)),
        ]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: ?number', () => {
    let source = 'var x: ?number';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Nullable(new type.Number()),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: string|number', () => {
    let source = 'var x: string|number';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Union([new type.String(), new type.Number()]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: string|number|null', () => {
    let source = 'var x: string|number|null';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Union([new type.String(), new type.Number(), new type.Null()]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: string&number', () => {
    let source = 'var x: string&number';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Intersection([new type.String(), new type.Number()]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('var x: string&number&null', () => {
    let source = 'var x: string&number&null';
    let expected = [
      new Var(
        new Token(TokenType.IDENTIFIER, 'x', undefined, 1),
        new type.Intersection([
          new type.String(),
          new type.Number(),
          new type.Null(),
        ]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('abc = 123', () => {
    let source = 'abc = 123';
    let expected = [
      new Expression(
        new expr.Assign(
          new Token(TokenType.IDENTIFIER, 'abc', undefined, 1),
          new expr.NumberLiteral(123),
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});

describe('blocks', () => {
  test('{ 1; 2; }', () => {
    let source = '{ 1; 2; }';
    let expected = [
      new Block([
        new Expression(new expr.NumberLiteral(1)),
        new Expression(new expr.NumberLiteral(2)),
      ]),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});

describe('if statements', () => {
  test('if (true) 2', () => {
    let source = 'if (true) 2';
    let expected = [
      new If(
        new expr.BooleanLiteral(true),
        new Expression(new expr.NumberLiteral(2)),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('if (true) {2;"5";}', () => {
    let source = 'if (true) {2;"5";}';
    let expected = [
      new If(
        new expr.BooleanLiteral(true),
        new Block([
          new Expression(new expr.NumberLiteral(2)),
          new Expression(new expr.StringLiteral('5')),
        ]),
        null,
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('if (true) 2; else 3', () => {
    // TODO don't require that ;
    let source = 'if (true) 2; else 3';
    let expected = [
      new If(
        new expr.BooleanLiteral(true),
        new Expression(new expr.NumberLiteral(2)),
        new Expression(new expr.NumberLiteral(3)),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('if (true) 2; else {5;}', () => {
    let source = 'if (true) 2; else {5;}';
    let expected = [
      new If(
        new expr.BooleanLiteral(true),
        new Expression(new expr.NumberLiteral(2)),
        new Block([new Expression(new expr.NumberLiteral(5))]),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });

  test('if (true) 2; else if (false) 5;', () => {
    let source = 'if (true) 2; else if (false) 5;';
    let expected = [
      new If(
        new expr.BooleanLiteral(true),
        new Expression(new expr.NumberLiteral(2)),
        new If(
          new expr.BooleanLiteral(false),
          new Expression(new expr.NumberLiteral(5)),
          null,
        ),
      ),
    ];
    let tokens = scan(source);
    let ast = parse(tokens);
    expect(ast).toEqual(expected);
  });
});
