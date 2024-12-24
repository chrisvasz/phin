// @ts-ignore
import { expect, test, describe } from 'bun:test';
import { Token, TokenType } from '../Token';
import scan from '../scanner';

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

test('++', () => {
  let expected = [new Token(TokenType.PLUS_PLUS, '++', undefined, 1), eof];
  let source = '++';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('--', () => {
  let expected = [new Token(TokenType.MINUS_MINUS, '--', undefined, 1), eof];
  let source = '--';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('!', () => {
  let expected = [new Token(TokenType.BANG, '!', undefined, 1), eof];
  let source = '!';
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

test('<=>', () => {
  let expected = [new Token(TokenType.SPACESHIP, '<=>', undefined, 1), eof];
  let source = '<=>';
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

test('===', () => {
  let expected = [
    new Token(TokenType.EQUAL_EQUAL_EQUAL, '===', undefined, 1),
    eof,
  ];
  let source = '===';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('!=', () => {
  let expected = [new Token(TokenType.BANG_EQUAL, '!=', undefined, 1), eof];
  let source = '!=';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('!==', () => {
  let expected = [
    new Token(TokenType.BANG_EQUAL_EQUAL, '!==', undefined, 1),
    eof,
  ];
  let source = '!==';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test(';', () => {
  let expected = [new Token(TokenType.SEMICOLON, ';', undefined, 1), eof];
  let source = ';';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test(':', () => {
  let expected = [new Token(TokenType.COLON, ':', undefined, 1), eof];
  let source = ':';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('::', () => {
  let expected = [new Token(TokenType.COLON_COLON, '::', undefined, 1), eof];
  let source = '::';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('?', () => {
  let expected = [new Token(TokenType.QUESTION, '?', undefined, 1), eof];
  let source = '?';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('??', () => {
  let expected = [new Token(TokenType.NULL_COALESCE, '??', undefined, 1), eof];
  let source = '??';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('?:', () => {
  let expected = [new Token(TokenType.ELVIS, '?:', undefined, 1), eof];
  let source = '?:';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('|', () => {
  let expected = [new Token(TokenType.PIPE, '|', undefined, 1), eof];
  let source = '|';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('&', () => {
  let expected = [new Token(TokenType.AMPERSAND, '&', undefined, 1), eof];
  let source = '&';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('||', () => {
  let expected = [new Token(TokenType.LOGICAL_OR, '||', undefined, 1), eof];
  let source = '||';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('&&', () => {
  let expected = [new Token(TokenType.LOGICAL_AND, '&&', undefined, 1), eof];
  let source = '&&';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test(';//comment', () => {
  let expected = [new Token(TokenType.SEMICOLON, ';', undefined, 1), eof];
  let source = ';//comment';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('=>', () => {
  let expected = [new Token(TokenType.ARROW, '=>', undefined, 1), eof];
  let source = '=>';
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

test('eol', () => {
  let expected = [
    new Token(TokenType.EOL, '\n', undefined, 1),
    new Token(TokenType.EOF, '', null, 2),
  ];
  let source = '\n';
  let actual = scan(source);
  expect(actual).toEqual(expected);
});

test('keywords', () => {
  const list = {
    abstract: TokenType.ABSTRACT,
    as: TokenType.AS,
    catch: TokenType.CATCH,
    class: TokenType.CLASS,
    const: TokenType.CONST,
    default: TokenType.DEFAULT,
    echo: TokenType.ECHO,
    else: TokenType.ELSE,
    extends: TokenType.EXTENDS,
    false: TokenType.FALSE,
    finally: TokenType.FINALLY,
    fun: TokenType.FUN,
    foreach: TokenType.FOREACH,
    for: TokenType.FOR,
    if: TokenType.IF,
    implements: TokenType.IMPLEMENTS,
    match: TokenType.MATCH,
    new: TokenType.NEW,
    null: TokenType.NULL,
    return: TokenType.RETURN,
    private: TokenType.PRIVATE,
    protected: TokenType.PROTECTED,
    public: TokenType.PUBLIC,
    static: TokenType.STATIC,
    super: TokenType.SUPER,
    this: TokenType.THIS,
    throw: TokenType.THROW,
    true: TokenType.TRUE,
    try: TokenType.TRY,
    val: TokenType.VAL,
    var: TokenType.VAR,
    while: TokenType.WHILE,
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

describe('number literals', () => {
  test('1', () => {
    let expected = [new Token(TokenType.NUMBER, '1', '1', 1), eof];
    let source = '1';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('1.2', () => {
    let expected = [new Token(TokenType.NUMBER, '1.2', '1.2', 1), eof];
    let source = '1.2';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('123', () => {
    let expected = [new Token(TokenType.NUMBER, '123', '123', 1), eof];
    let source = '123';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('123_', () => {
    let expected = [new Token(TokenType.NUMBER, '123_', '123', 1), eof];
    let source = '123_';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('123.45', () => {
    let expected = [new Token(TokenType.NUMBER, '123.45', '123.45', 1), eof];
    let source = '123.45';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('123_456', () => {
    let expected = [new Token(TokenType.NUMBER, '123_456', '123456', 1), eof];
    let source = '123_456';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('123_456.78', () => {
    let expected = [
      new Token(TokenType.NUMBER, '123_456.78', '123456.78', 1),
      eof,
    ];
    let source = '123_456.78';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('123_456.78_90', () => {
    let expected = [
      new Token(TokenType.NUMBER, '123_456.78_90', '123456.7890', 1),
      eof,
    ];
    let source = '123_456.78_90';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('1_2_3_4_5_6_7_8_9_0', () => {
    let expected = [
      new Token(TokenType.NUMBER, '1_2_3_4_5_6_7_8_9_0', '1234567890', 1),
      eof,
    ];
    let source = '1_2_3_4_5_6_7_8_9_0';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0x1', () => {
    let expected = [new Token(TokenType.NUMBER, '0x1', '0x1', 1), eof];
    let source = '0x1';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0X12', () => {
    let expected = [new Token(TokenType.NUMBER, '0X12', '0X12', 1), eof];
    let source = '0X12';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0x012_345_678_9AB_CDE_F', () => {
    let expected = [
      new Token(
        TokenType.NUMBER,
        '0x012_345_678_9AB_CDE_F',
        '0x0123456789ABCDEF',
        1,
      ),
      eof,
    ];
    let source = '0x012_345_678_9AB_CDE_F';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0o1', () => {
    let expected = [new Token(TokenType.NUMBER, '0o1', '0o1', 1), eof];
    let source = '0o1';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0O10', () => {
    let expected = [new Token(TokenType.NUMBER, '0O10', '0O10', 1), eof];
    let source = '0O10';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0o012_345_67', () => {
    let expected = [
      new Token(TokenType.NUMBER, '0o012_345_67', '0o01234567', 1),
      eof,
    ];
    let source = '0o012_345_67';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0b1', () => {
    let expected = [new Token(TokenType.NUMBER, '0b1', '0b1', 1), eof];
    let source = '0b1';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0B10', () => {
    let expected = [new Token(TokenType.NUMBER, '0B10', '0B10', 1), eof];
    let source = '0B10';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });

  test('0b010_101_011', () => {
    let expected = [
      new Token(TokenType.NUMBER, '0b010_101_011', '0b010101011', 1),
      eof,
    ];
    let source = '0b010_101_011';
    let actual = scan(source);
    expect(actual).toEqual(expected);
  });
});
