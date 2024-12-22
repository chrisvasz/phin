// @ts-ignore
import { expect, test } from 'bun:test';
import scan from './Scanner';
import parse from './parser';
import { AstPrinter } from './AstPrinter';

function print(source: string): string {
  let tokens = scan(source);
  let ast = parse(tokens);
  return new AstPrinter().printStatements(ast);
}

test('1', () => {
  let source = '1';
  let expected = `
ExpressionStatement
  NumberLiteral 1
`.trim();
  let actual = print(source);
  expect(actual).toEqual(expected);
});

test('"hello"', () => {
  let source = '"hello"';
  let expected = `
ExpressionStatement
  StringLiteral "hello"
`.trim();
  let actual = print(source);
  expect(actual).toEqual(expected);
});

test('true', () => {
  let source = 'true';
  let expected = `
ExpressionStatement
  BooleanLiteral true
`.trim();
  let actual = print(source);
  expect(actual).toEqual(expected);
});

test('false', () => {
  let source = 'false';
  let expected = `
ExpressionStatement
  BooleanLiteral false
`.trim();
  let actual = print(source);
  expect(actual).toEqual(expected);
});

test('null', () => {
  let source = 'null';
  let expected = `
ExpressionStatement
  NullLiteral
`.trim();
  let actual = print(source);
  expect(actual).toEqual(expected);
});

test('1 + 2', () => {
  let source = '1 + 2';
  let expected = `
ExpressionStatement
  Binary +
    NumberLiteral 1
    NumberLiteral 2
`.trim();
  let actual = print(source);
  expect(actual).toEqual(expected);
});
