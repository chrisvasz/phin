// @ts-ignore
import { expect, test, describe } from 'bun:test';
import scan from '../scanner';
import parse from '../parser';
import * as stmt from '../stmt';
import * as expr from '../expr';
import { Expr } from '../expr';

function ast(source: string) {
  return parse(scan(source));
}

// https://www.php.net/manual/en/language.operators.precedence.php
// TODO bitwise operators << >> & ^ | ~

function expressions(ex: Expr) {
  return [new stmt.Expression(ex)];
}

function unary(operator: string, right: Expr) {
  return new expr.Unary(operator, right);
}

function binary(left: Expr, operator: string, right: Expr) {
  return new expr.Binary(left, operator, right);
}

function ternary(condition: Expr, left: Expr, right: Expr) {
  return new expr.Ternary(condition, left, right);
}

function assign(name: string, operator: string, right: Expr) {
  return new expr.Assign(name, operator, right);
}

function new_(ex: Expr) {
  return new expr.New(ex);
}

function clone(ex: Expr) {
  return new expr.Clone(ex);
}

function identifier(name: string) {
  return new expr.Identifier(name);
}

const a = identifier('a');
const b = identifier('b');
const c = identifier('c');
const d = identifier('d');
const e = identifier('e');

describe('binary', () => {
  const binaryOperators = [
    testRightAssociative('**'),
    testLeftAssociative('instanceof'),
    testLeftAssociative('*', '/', '%'),
    testLeftAssociative('+', '-'),
    testLeftAssociative('+.'),
    testNonAssociative('<', '<=', '>', '>='),
    testNonAssociative('==', '===', '!=', '!==', '<=>'),
    testLeftAssociative('&&'),
    testLeftAssociative('||'),
    testRightAssociative('??'),
    // TODO where should ?: go? associativity?
  ];
  for (let i = 0; i < binaryOperators.length; i++) {
    let ops = binaryOperators[i];
    let lowerOps = binaryOperators[i + 1] ?? [];
    for (let op of ops) {
      describe(op, () => {
        testBasicBinaryOp(op);
        for (let lowerOp of lowerOps) {
          testBinaryOpPrecedenceOrder(lowerOp, op);
        }
      });
    }
  }

  function testBasicBinaryOp(op: string) {
    test(`${op}`, () => {
      let source = `a ${op} b`;
      let expected = expressions(binary(a, op, b));
      expect(ast(source)).toEqual(expected);
    });
  }

  function testLeftAssociative(...ops: string[]): string[] {
    for (let op of ops) {
      test(`${op} is left associative`, () => {
        let source = `a ${op} b ${op} c`;
        let expected = expressions(binary(binary(a, op, b), op, c));
        expect(ast(source)).toEqual(expected);
      });
    }
    return ops;
  }

  function testRightAssociative(...ops: string[]): string[] {
    for (let op of ops) {
      test(`${op} is right associative`, () => {
        let source = `a ${op} b ${op} c`;
        let expected = expressions(binary(a, op, binary(b, op, c)));
        expect(ast(source)).toEqual(expected);
      });
    }
    return ops;
  }

  function testNonAssociative(...ops: string[]): string[] {
    for (let op of ops) {
      test.todo(`${op} is non-associative`);
    }
    return ops;
  }

  function testBinaryOpPrecedenceOrder(
    lowerOperator: string,
    higherOperator: string,
  ) {
    test(`${lowerOperator} lower precedence than ${higherOperator}`, () => {
      let source = `a ${lowerOperator} b ${higherOperator} c`;
      let expected = expressions(
        binary(a, lowerOperator, binary(b, higherOperator, c)),
      );
      expect(ast(source)).toEqual(expected);
    });
  }
});

describe('unary', () => {
  // all prefix versions
  const unaryOperators = ['+', '-', '++', '--', '!'];
  for (let op of unaryOperators) {
    testBasicUnaryOp(op);
    testUnaryOpHigherPrecedenceThanExponentiation(op);
    testUnaryOpLowerPrecedenceThanNew(op);
  }

  function testBasicUnaryOp(op: string) {
    test(`${op}`, () => {
      let source = `${op}a`;
      let expected = expressions(unary(op, a));
      expect(ast(source)).toEqual(expected);
    });
  }

  function testUnaryOpHigherPrecedenceThanExponentiation(op: string) {
    test(`${op} higher precedence than **`, () => {
      let source = `${op} a ** b`;
      let expected = expressions(binary(unary(op, a), '**', b));
      expect(ast(source)).toEqual(expected);
    });
  }

  function testUnaryOpLowerPrecedenceThanNew(op: string) {
    test(`${op} lower precedence than new`, () => {
      let source = `${op} new a`;
      let expected = expressions(unary(op, new_(a)));
      expect(ast(source)).toEqual(expected);
    });
  }
});

describe('postfix', () => {
  test('a++', () => {
    let source = 'a++';
    let expected = expressions(new expr.Postfix(a, '++'));
    expect(ast(source)).toEqual(expected);
  });

  test('a--', () => {
    let source = 'a--';
    let expected = expressions(new expr.Postfix(a, '--'));
    expect(ast(source)).toEqual(expected);
  });

  test('a++ + ++a', () => {
    let source = 'a++ + ++a';
    let expected = expressions(
      binary(new expr.Postfix(a, '++'), '+', new expr.Prefix('++', a)),
    );
    expect(ast(source)).toEqual(expected);
  });

  test.todo('precedence');
});

describe('ternary', () => {
  test('a ? b : c', () => {
    let source = 'a ? b : c';
    let expected = expressions(ternary(a, b, c));
    expect(ast(source)).toEqual(expected);
  });

  test.todo('ternary operator is non-associative');

  /*
  test('a ? b : c ? d : e', () => {
    // old behavior pre-php-8.0
    // https://www.php.net/manual/en/language.operators.comparison.php#language.operators.comparison.ternary
    let source = 'a ? b : c ? d : e';
    let expected = expressions(ternary(ternary(a, b, c), d, e));
    expect(ast(source)).toEqual(expected);
  });
  */

  test('ternary lower precedence than ??', () => {
    let source = 'a ? b : c ?? d';
    let expected = expressions(ternary(a, b, binary(c, '??', d)));
    expect(ast(source)).toEqual(expected);
  });
});

describe('assign', () => {
  const operators = [
    '=',
    '+=',
    '-=',
    '*=',
    '/=',
    '%=',
    '**=',
    '??=',
    '||=',
    '+.=',
  ];
  for (let op of operators) {
    testBasicAssign(op);
    testRightAssociative(op);
    testAssignLowerPrecedenceThanTernary(op);
  }

  function testBasicAssign(op: string) {
    test(`${op}`, () => {
      let source = `a ${op} b`;
      let expected = expressions(assign('a', op, b));
      expect(ast(source)).toEqual(expected);
    });
  }

  function testRightAssociative(...ops: string[]): string[] {
    for (let op of ops) {
      test(`${op} is right associative`, () => {
        let source = `a ${op} b ${op} c`;
        let expected = expressions(assign('a', op, assign('b', op, c)));
        expect(ast(source)).toEqual(expected);
      });
    }
    return ops;
  }

  function testAssignLowerPrecedenceThanTernary(op: string) {
    test(`${op} lower precedence than ternary`, () => {
      let source = `a ${op} a ? b : c`;
      let expected = expressions(assign('a', op, ternary(a, b, c)));
      expect(ast(source)).toEqual(expected);
    });
  }
});

describe('new/clone', () => {
  test('new a', () => {
    let source = 'new a';
    let expected = expressions(new_(a));
    expect(ast(source)).toEqual(expected);
  });

  test('clone a', () => {
    let source = 'clone a';
    let expected = expressions(clone(a));
    expect(ast(source)).toEqual(expected);
  });

  test.todo('precedence');
});

describe('terminators', () => {
  test('a;b', () => {
    let source = 'a;b';
    let expected = [new stmt.Expression(a), new stmt.Expression(b)];
    expect(ast(source)).toEqual(expected);
  });
});

// TODO pull these from parser.classes.test.ts
test.todo('call operator');
test.todo('dot operator');
test.todo('?. operator');
test.todo('array access operator');
