// @ts-ignore
import { expect, test } from 'bun:test';
import scan from '../Scanner';
import parse from '../parser';
import { PhpPrinter } from '../PhpPrinter';

function print(source: string): string {
  let tokens = scan(source);
  let ast = parse(tokens);
  return new PhpPrinter().printStatements(ast);
}

test('1', () => {
  let source = '1';
  let expected = '1;';
  let tokens = scan(source);
  let ast = parse(tokens);
  let actual = new PhpPrinter().printStatements(ast);
  expect(actual).toEqual(expected);
});

test('1 + 2', () => {
  let source = '1 + 2';
  let expected = '1 + 2;';
  let actual = print(source);
  expect(actual).toEqual(expected);
});

test('1 + 2 * 3', () => {
  let source = '1 + 2 * 3';
  let expected = '1 + 2 * 3;';
  let actual = print(source);
  expect(actual).toEqual(expected);
});

test('"hello"', () => {
  let source = '"hello"';
  let expected = '"hello";';
  let actual = print(source);
  expect(actual).toEqual(expected);
});

test('null', () => {
  let source = 'null';
  let expected = 'null;';
  let actual = print(source);
  expect(actual).toEqual(expected);
});

test('var abc', () => {
  let source = 'var abc';
  let expected = '$abc;';
  let actual = print(source);
  expect(actual).toEqual(expected);
});

test('var abc = 123', () => {
  let source = 'var abc = 123';
  let expected = '$abc = 123;';
  let actual = print(source);
  expect(actual).toEqual(expected);
});

test('var abc = 123 + 456', () => {
  let source = 'var abc = 123 + 456';
  let expected = '$abc = 123 + 456;';
  let actual = print(source);
  expect(actual).toEqual(expected);
});

test('var abc = "hello"; abc = 5', () => {
  let source = 'var abc = "hello"; abc = 5';
  let expected = '$abc = "hello";\n$abc = 5;';
  let actual = print(source);
  expect(actual).toEqual(expected);
});

test('echo "hello"', () => {
  let source = 'echo "hello"';
  let expected = 'echo "hello";';
  let actual = print(source);
  expect(actual).toEqual(expected);
});
