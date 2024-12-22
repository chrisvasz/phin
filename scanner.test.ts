// @ts-ignore
import { expect, test } from 'bun:test';
import { Token, TokenType } from './Token';
import scan from './Scanner';

const eof = new Token(TokenType.EOF, '', null, 1);

test('(', () => {
  let expected = [new Token(TokenType.LEFT_PAREN, '(', undefined, 1), eof];
  let source = '(';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test(')', () => {
  let expected = [new Token(TokenType.RIGHT_PAREN, ')', undefined, 1), eof];
  let source = ')';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('()', () => {
  let expected = [
    new Token(TokenType.LEFT_PAREN, '(', undefined, 1),
    new Token(TokenType.RIGHT_PAREN, ')', undefined, 1),
    eof,
  ];
  let source = '()';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('{}', () => {
  let expected = [
    new Token(TokenType.LEFT_BRACE, '{', undefined, 1),
    new Token(TokenType.RIGHT_BRACE, '}', undefined, 1),
    eof,
  ];
  let source = '{}';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('+-*/', () => {
  let expected = [
    new Token(TokenType.PLUS, '+', undefined, 1),
    new Token(TokenType.MINUS, '-', undefined, 1),
    new Token(TokenType.STAR, '*', undefined, 1),
    new Token(TokenType.SLASH, '/', undefined, 1),
    eof,
  ];
  let source = '+-*/';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('!', () => {
  let expected = [new Token(TokenType.BANG, '!', undefined, 1), eof];
  let source = '!';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('!=', () => {
  let expected = [new Token(TokenType.BANG_EQUAL, '!=', undefined, 1), eof];
  let source = '!=';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('<', () => {
  let expected = [new Token(TokenType.LESS, '<', undefined, 1), eof];
  let source = '<';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('<=', () => {
  let expected = [new Token(TokenType.LESS_EQUAL, '<=', undefined, 1), eof];
  let source = '<=';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('>', () => {
  let expected = [new Token(TokenType.GREATER, '>', undefined, 1), eof];
  let source = '>';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('>=', () => {
  let expected = [new Token(TokenType.GREATER_EQUAL, '>=', undefined, 1), eof];
  let source = '>=';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('=', () => {
  let expected = [new Token(TokenType.EQUAL, '=', undefined, 1), eof];
  let source = '=';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('==', () => {
  let expected = [new Token(TokenType.EQUAL_EQUAL, '==', undefined, 1), eof];
  let source = '==';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test(';', () => {
  let expected = [new Token(TokenType.SEMICOLON, ';', undefined, 1), eof];
  let source = ';';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test(';//comment', () => {
  let expected = [new Token(TokenType.SEMICOLON, ';', undefined, 1), eof];
  let source = ';//comment';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('123', () => {
  let expected = [new Token(TokenType.NUMBER, '123', 123, 1), eof];
  let source = '123';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('123.45', () => {
  let expected = [new Token(TokenType.NUMBER, '123.45', 123.45, 1), eof];
  let source = '123.45';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('"string literal"', () => {
  let expected = [
    new Token(TokenType.STRING, '"string literal"', 'string literal', 1),
    eof,
  ];
  let source = '"string literal"';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('keywords', () => {
  const list = {
    class: TokenType.CLASS,
    else: TokenType.ELSE,
    false: TokenType.FALSE,
    fun: TokenType.FUN,
    for: TokenType.FOR,
    if: TokenType.IF,
    match: TokenType.MATCH,
    null: TokenType.NULL,
    return: TokenType.RETURN,
    super: TokenType.SUPER,
    this: TokenType.THIS,
    true: TokenType.TRUE,
    val: TokenType.VAL,
    var: TokenType.VAR,
  };
  const source = Object.keys(list);
  const tokens = Object.values(list).map(
    (type, i) => new Token(type, source[i], undefined, 1),
  );
  tokens.push(eof);
  let expected = tokens;
  let actual = scan(source.join(' '));
  expect(actual).toEqual(expected);
});

test.skip('malformed number', () => {
  let source = '123.';
  expect(() => scan(source)).toThrow();
});
