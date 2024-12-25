// @ts-ignore
import { expect, test, describe } from 'bun:test';
import { Token, TokenType } from '../token';
import scan from '../scanner';

const {
  ABSTRACT,
  AMPERSAND,
  ARROW,
  AS,
  BANG_EQUAL_EQUAL,
  BANG_EQUAL,
  BANG,
  CATCH,
  CLASS,
  COLON_COLON,
  COLON,
  COMMA,
  CONST,
  DEFAULT,
  DOT,
  ECHO,
  ELSE,
  ELVIS,
  EOF,
  EQUAL_EQUAL_EQUAL,
  EQUAL_EQUAL,
  EQUAL,
  EXTENDS,
  FALSE,
  FINALLY,
  FOREACH,
  FOR,
  FUN,
  GREATER_EQUAL,
  GREATER,
  IDENTIFIER,
  IF,
  IMPLEMENTS,
  LEFT_BRACE,
  LEFT_BRACKET,
  LEFT_PAREN,
  LESS_EQUAL,
  LESS,
  LOGICAL_AND,
  LOGICAL_OR,
  MATCH,
  MINUS_MINUS,
  MINUS,
  NEW,
  NULL_COALESCE,
  NULL,
  NUMBER,
  OPTIONAL_CHAIN,
  PIPE,
  PLUS_PLUS,
  PLUS,
  PRIVATE,
  PROTECTED,
  PUBLIC,
  QUESTION,
  RETURN,
  RIGHT_BRACE,
  RIGHT_BRACKET,
  RIGHT_PAREN,
  SEMICOLON,
  SLASH,
  SPACESHIP,
  STAR,
  STATIC,
  STRING,
  SUPER,
  THIS,
  THROW,
  TRUE,
  TRY,
  VAL,
  VAR,
  WHILE,
} = TokenType;

const eof = (line = 1) => new Token(EOF, '', null, line);

describe('tokens', () => {
  test('(', () => {
    let expected = [new Token(LEFT_PAREN, '(', undefined, 1), eof()];
    let source = '(';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test(')', () => {
    let expected = [new Token(RIGHT_PAREN, ')', undefined, 1), eof()];
    let source = ')';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('()', () => {
    let expected = [
      new Token(LEFT_PAREN, '(', undefined, 1),
      new Token(RIGHT_PAREN, ')', undefined, 1),
      eof(),
    ];
    let source = '()';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('[]', () => {
    let expected = [
      new Token(LEFT_BRACKET, '[', undefined, 1),
      new Token(RIGHT_BRACKET, ']', undefined, 1),
      eof(),
    ];
    let source = '[]';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('{}', () => {
    let expected = [
      new Token(LEFT_BRACE, '{', undefined, 1),
      new Token(RIGHT_BRACE, '}', undefined, 1),
      eof(),
    ];
    let source = '{}';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('+-*/', () => {
    let expected = [
      new Token(PLUS, '+', undefined, 1),
      new Token(MINUS, '-', undefined, 1),
      new Token(STAR, '*', undefined, 1),
      new Token(SLASH, '/', undefined, 1),
      eof(),
    ];
    let source = '+-*/';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('++', () => {
    let expected = [new Token(PLUS_PLUS, '++', undefined, 1), eof()];
    let source = '++';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('--', () => {
    let expected = [new Token(MINUS_MINUS, '--', undefined, 1), eof()];
    let source = '--';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('!', () => {
    let expected = [new Token(BANG, '!', undefined, 1), eof()];
    let source = '!';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('<', () => {
    let expected = [new Token(LESS, '<', undefined, 1), eof()];
    let source = '<';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('<=', () => {
    let expected = [new Token(LESS_EQUAL, '<=', undefined, 1), eof()];
    let source = '<=';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('>', () => {
    let expected = [new Token(GREATER, '>', undefined, 1), eof()];
    let source = '>';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('>=', () => {
    let expected = [new Token(GREATER_EQUAL, '>=', undefined, 1), eof()];
    let source = '>=';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('<=>', () => {
    let expected = [new Token(SPACESHIP, '<=>', undefined, 1), eof()];
    let source = '<=>';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('=', () => {
    let expected = [new Token(EQUAL, '=', undefined, 1), eof()];
    let source = '=';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('==', () => {
    let expected = [new Token(EQUAL_EQUAL, '==', undefined, 1), eof()];
    let source = '==';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('===', () => {
    let expected = [new Token(EQUAL_EQUAL_EQUAL, '===', undefined, 1), eof()];
    let source = '===';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('!=', () => {
    let expected = [new Token(BANG_EQUAL, '!=', undefined, 1), eof()];
    let source = '!=';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('!==', () => {
    let expected = [new Token(BANG_EQUAL_EQUAL, '!==', undefined, 1), eof()];
    let source = '!==';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test(',', () => {
    let expected = [new Token(COMMA, ',', undefined, 1), eof()];
    let source = ',';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test(';', () => {
    let expected = [new Token(SEMICOLON, ';', undefined, 1), eof()];
    let source = ';';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test(':', () => {
    let expected = [new Token(COLON, ':', undefined, 1), eof()];
    let source = ':';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('::', () => {
    let expected = [new Token(COLON_COLON, '::', undefined, 1), eof()];
    let source = '::';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('?', () => {
    let expected = [new Token(QUESTION, '?', undefined, 1), eof()];
    let source = '?';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('??', () => {
    let expected = [new Token(NULL_COALESCE, '??', undefined, 1), eof()];
    let source = '??';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('?.', () => {
    let expected = [new Token(OPTIONAL_CHAIN, '?.', undefined, 1), eof()];
    let source = '?.';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('?:', () => {
    let expected = [new Token(ELVIS, '?:', undefined, 1), eof()];
    let source = '?:';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('|', () => {
    let expected = [new Token(PIPE, '|', undefined, 1), eof()];
    let source = '|';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('&', () => {
    let expected = [new Token(AMPERSAND, '&', undefined, 1), eof()];
    let source = '&';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('||', () => {
    let expected = [new Token(LOGICAL_OR, '||', undefined, 1), eof()];
    let source = '||';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('&&', () => {
    let expected = [new Token(LOGICAL_AND, '&&', undefined, 1), eof()];
    let source = '&&';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test(';//comment', () => {
    let expected = [new Token(SEMICOLON, ';', undefined, 1), eof()];
    let source = ';//comment';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('=>', () => {
    let expected = [new Token(ARROW, '=>', undefined, 1), eof()];
    let source = '=>';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('"string literal"', () => {
    let expected = [
      new Token(STRING, '"string literal"', 'string literal', 1),
      eof(),
    ];
    let source = '"string literal"';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('keywords', () => {
    const list = {
      abstract: ABSTRACT,
      as: AS,
      catch: CATCH,
      class: CLASS,
      const: CONST,
      default: DEFAULT,
      echo: ECHO,
      else: ELSE,
      extends: EXTENDS,
      false: FALSE,
      finally: FINALLY,
      fun: FUN,
      foreach: FOREACH,
      for: FOR,
      if: IF,
      implements: IMPLEMENTS,
      match: MATCH,
      new: NEW,
      null: NULL,
      return: RETURN,
      private: PRIVATE,
      protected: PROTECTED,
      public: PUBLIC,
      static: STATIC,
      super: SUPER,
      this: THIS,
      throw: THROW,
      true: TRUE,
      try: TRY,
      val: VAL,
      var: VAR,
      while: WHILE,
    };
    const source = Object.keys(list);
    const tokens = Object.values(list).map(
      (type, i) => new Token(type, source[i], undefined, 1),
    );
    tokens.push(eof());
    let expected = tokens;
    let actual = scan(source.join(' '));
    expect(actual).toEqual(expected);
  });
});

describe('number literals', () => {
  test('1', () => {
    let expected = [new Token(NUMBER, '1', '1', 1), eof()];
    let source = '1';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('1.2', () => {
    let expected = [new Token(NUMBER, '1.2', '1.2', 1), eof()];
    let source = '1.2';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('123', () => {
    let expected = [new Token(NUMBER, '123', '123', 1), eof()];
    let source = '123';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('123_', () => {
    let expected = [new Token(NUMBER, '123_', '123', 1), eof()];
    let source = '123_';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('123.45', () => {
    let expected = [new Token(NUMBER, '123.45', '123.45', 1), eof()];
    let source = '123.45';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('123_456', () => {
    let expected = [new Token(NUMBER, '123_456', '123456', 1), eof()];
    let source = '123_456';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('123_456.78', () => {
    let expected = [new Token(NUMBER, '123_456.78', '123456.78', 1), eof()];
    let source = '123_456.78';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('123_456.78_90', () => {
    let expected = [
      new Token(NUMBER, '123_456.78_90', '123456.7890', 1),
      eof(),
    ];
    let source = '123_456.78_90';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('1_2_3_4_5_6_7_8_9_0', () => {
    let expected = [
      new Token(NUMBER, '1_2_3_4_5_6_7_8_9_0', '1234567890', 1),
      eof(),
    ];
    let source = '1_2_3_4_5_6_7_8_9_0';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0x1', () => {
    let expected = [new Token(NUMBER, '0x1', '0x1', 1), eof()];
    let source = '0x1';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0X12', () => {
    let expected = [new Token(NUMBER, '0X12', '0X12', 1), eof()];
    let source = '0X12';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0x012_345_678_9AB_CDE_F', () => {
    let expected = [
      new Token(NUMBER, '0x012_345_678_9AB_CDE_F', '0x0123456789ABCDEF', 1),
      eof(),
    ];
    let source = '0x012_345_678_9AB_CDE_F';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0o1', () => {
    let expected = [new Token(NUMBER, '0o1', '0o1', 1), eof()];
    let source = '0o1';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0O10', () => {
    let expected = [new Token(NUMBER, '0O10', '0O10', 1), eof()];
    let source = '0O10';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0o012_345_67', () => {
    let expected = [new Token(NUMBER, '0o012_345_67', '0o01234567', 1), eof()];
    let source = '0o012_345_67';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0b1', () => {
    let expected = [new Token(NUMBER, '0b1', '0b1', 1), eof()];
    let source = '0b1';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0B10', () => {
    let expected = [new Token(NUMBER, '0B10', '0B10', 1), eof()];
    let source = '0B10';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0b010_101_011', () => {
    let expected = [
      new Token(NUMBER, '0b010_101_011', '0b010101011', 1),
      eof(),
    ];
    let source = '0b010_101_011';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });
});
