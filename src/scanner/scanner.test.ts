// @ts-ignore
import { expect, test, describe } from 'bun:test'
import { Token, TokenType } from '../token'
import scan from './scanner'

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
  CLONE,
  COLON_COLON,
  COLON,
  COMMA,
  CONST,
  DEFAULT,
  DOT,
  DOUBLE_QUOTE,
  ECHO,
  ELSE,
  ELVIS,
  EOF,
  EQUAL_EQUAL_EQUAL,
  EQUAL_EQUAL,
  EQUAL,
  EXTENDS,
  FALSE,
  FLOAT,
  FINAL,
  FINALLY,
  FOREACH,
  FOR,
  FUN,
  GREATER_EQUAL,
  GREATER,
  IDENTIFIER,
  IF,
  IMPLEMENTS,
  INSTANCEOF,
  INT,
  LEFT_BRACE,
  LEFT_BRACKET,
  LEFT_PAREN,
  LESS_EQUAL,
  LESS,
  LOGICAL_AND,
  LOGICAL_OR_EQUAL,
  LOGICAL_OR,
  MATCH,
  MINUS_EQUAL,
  MINUS_MINUS,
  MINUS,
  NEW,
  NULL_COALESCE_EQUAL,
  NULL_COALESCE,
  NULL,
  NUMBER,
  OPTIONAL_CHAIN,
  PERCENT_EQUAL,
  PERCENT,
  PIPE,
  PLUS_DOT_EQUAL,
  PLUS_DOT,
  PLUS_EQUAL,
  PLUS_PLUS,
  PLUS,
  PRIVATE,
  PROTECTED,
  PUBLIC,
  QUESTION,
  READONLY,
  RETURN,
  RIGHT_BRACE,
  RIGHT_BRACKET,
  RIGHT_PAREN,
  SEMICOLON,
  SLASH_EQUAL,
  SLASH,
  SPACESHIP,
  STAR_EQUAL,
  STAR_STAR_EQUAL,
  STAR_STAR,
  STAR,
  STATIC,
  STRING_PART,
  STRING,
  SUPER,
  THIS,
  THROW,
  TRUE,
  TRY,
  VAL,
  VAR,
  WHILE,
} = TokenType

const eof = (line = 1) => new Token(EOF, '', null, line)

describe('scan tokens', () => {
  test('(', () => {
    let expected = [new Token(LEFT_PAREN, '(', undefined, 1), eof()]
    let source = '('
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test(')', () => {
    let expected = [new Token(RIGHT_PAREN, ')', undefined, 1), eof()]
    let source = ')'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('()', () => {
    let expected = [
      new Token(LEFT_PAREN, '(', undefined, 1),
      new Token(RIGHT_PAREN, ')', undefined, 1),
      eof(),
    ]
    let source = '()'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('[]', () => {
    let expected = [
      new Token(LEFT_BRACKET, '[', undefined, 1),
      new Token(RIGHT_BRACKET, ']', undefined, 1),
      eof(),
    ]
    let source = '[]'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('{}', () => {
    let expected = [
      new Token(LEFT_BRACE, '{', undefined, 1),
      new Token(RIGHT_BRACE, '}', undefined, 1),
      eof(),
    ]
    let source = '{}'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('+-*/', () => {
    let expected = [
      new Token(PLUS, '+', undefined, 1),
      new Token(MINUS, '-', undefined, 1),
      new Token(STAR, '*', undefined, 1),
      new Token(SLASH, '/', undefined, 1),
      eof(),
    ]
    let source = '+-*/'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('++', () => {
    let expected = [new Token(PLUS_PLUS, '++', undefined, 1), eof()]
    let source = '++'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('--', () => {
    let expected = [new Token(MINUS_MINUS, '--', undefined, 1), eof()]
    let source = '--'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('**', () => {
    let expected = [new Token(STAR_STAR, '**', undefined, 1), eof()]
    let source = '**'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('%', () => {
    let expected = [new Token(PERCENT, '%', undefined, 1), eof()]
    let source = '%'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('!', () => {
    let expected = [new Token(BANG, '!', undefined, 1), eof()]
    let source = '!'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('<', () => {
    let expected = [new Token(LESS, '<', undefined, 1), eof()]
    let source = '<'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('<=', () => {
    let expected = [new Token(LESS_EQUAL, '<=', undefined, 1), eof()]
    let source = '<='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('>', () => {
    let expected = [new Token(GREATER, '>', undefined, 1), eof()]
    let source = '>'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('>=', () => {
    let expected = [new Token(GREATER_EQUAL, '>=', undefined, 1), eof()]
    let source = '>='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('<=>', () => {
    let expected = [new Token(SPACESHIP, '<=>', undefined, 1), eof()]
    let source = '<=>'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('=', () => {
    let expected = [new Token(EQUAL, '=', undefined, 1), eof()]
    let source = '='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('+=', () => {
    let expected = [new Token(PLUS_EQUAL, '+=', undefined, 1), eof()]
    let source = '+='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('-=', () => {
    let expected = [new Token(MINUS_EQUAL, '-=', undefined, 1), eof()]
    let source = '-='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('*=', () => {
    let expected = [new Token(STAR_EQUAL, '*=', undefined, 1), eof()]
    let source = '*='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('/=', () => {
    let expected = [new Token(SLASH_EQUAL, '/=', undefined, 1), eof()]
    let source = '/='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('%=', () => {
    let expected = [new Token(PERCENT_EQUAL, '%=', undefined, 1), eof()]
    let source = '%='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('**=', () => {
    let expected = [new Token(STAR_STAR_EQUAL, '**=', undefined, 1), eof()]
    let source = '**='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('||=', () => {
    let expected = [new Token(LOGICAL_OR_EQUAL, '||=', undefined, 1), eof()]
    let source = '||='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('??=', () => {
    let expected = [new Token(NULL_COALESCE_EQUAL, '??=', undefined, 1), eof()]
    let source = '??='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('+.', () => {
    let expected = [new Token(PLUS_DOT, '+.', undefined, 1), eof()]
    let source = '+.'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('+.=', () => {
    let expected = [new Token(PLUS_DOT_EQUAL, '+.=', undefined, 1), eof()]
    let source = '+.='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('==', () => {
    let expected = [new Token(EQUAL_EQUAL, '==', undefined, 1), eof()]
    let source = '=='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('===', () => {
    let expected = [new Token(EQUAL_EQUAL_EQUAL, '===', undefined, 1), eof()]
    let source = '==='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('!=', () => {
    let expected = [new Token(BANG_EQUAL, '!=', undefined, 1), eof()]
    let source = '!='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('!==', () => {
    let expected = [new Token(BANG_EQUAL_EQUAL, '!==', undefined, 1), eof()]
    let source = '!=='
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test(',', () => {
    let expected = [new Token(COMMA, ',', undefined, 1), eof()]
    let source = ','
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test(';', () => {
    let expected = [new Token(SEMICOLON, ';', undefined, 1), eof()]
    let source = ';'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test(':', () => {
    let expected = [new Token(COLON, ':', undefined, 1), eof()]
    let source = ':'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('::', () => {
    let expected = [new Token(COLON_COLON, '::', undefined, 1), eof()]
    let source = '::'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('?', () => {
    let expected = [new Token(QUESTION, '?', undefined, 1), eof()]
    let source = '?'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('??', () => {
    let expected = [new Token(NULL_COALESCE, '??', undefined, 1), eof()]
    let source = '??'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('?.', () => {
    let expected = [new Token(OPTIONAL_CHAIN, '?.', undefined, 1), eof()]
    let source = '?.'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('?:', () => {
    let expected = [new Token(ELVIS, '?:', undefined, 1), eof()]
    let source = '?:'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('|', () => {
    let expected = [new Token(PIPE, '|', undefined, 1), eof()]
    let source = '|'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('&', () => {
    let expected = [new Token(AMPERSAND, '&', undefined, 1), eof()]
    let source = '&'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('||', () => {
    let expected = [new Token(LOGICAL_OR, '||', undefined, 1), eof()]
    let source = '||'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('&&', () => {
    let expected = [new Token(LOGICAL_AND, '&&', undefined, 1), eof()]
    let source = '&&'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test(';//comment', () => {
    let expected = [new Token(SEMICOLON, ';', undefined, 1), eof()]
    let source = ';//comment'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('=>', () => {
    let expected = [new Token(ARROW, '=>', undefined, 1), eof()]
    let source = '=>'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('.', () => {
    let expected = [new Token(DOT, '.', undefined, 1), eof()]
    let source = '.'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })
})

describe('keywords', () => {
  const list = {
    abstract: ABSTRACT,
    as: AS,
    catch: CATCH,
    class: CLASS,
    clone: CLONE,
    const: CONST,
    default: DEFAULT,
    echo: ECHO,
    else: ELSE,
    extends: EXTENDS,
    false: FALSE,
    final: FINAL,
    finally: FINALLY,
    fun: FUN,
    foreach: FOREACH,
    for: FOR,
    if: IF,
    instanceof: INSTANCEOF,
    implements: IMPLEMENTS,
    match: MATCH,
    new: NEW,
    null: NULL,
    readonly: READONLY,
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
  }
  for (let [word, type] of Object.entries(list)) {
    test(word, () => {
      let expected = [new Token(type, word, undefined, 1), eof()]
      let actual = scan(word)
      expect(actual).toEqual(expected)
    })
  }
})

describe('scan number literals', () => {
  test('1', () => {
    let expected = [new Token(INT, '1', '1', 1), eof()]
    let source = '1'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('1.2', () => {
    let expected = [new Token(FLOAT, '1.2', '1.2', 1), eof()]
    let source = '1.2'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('123', () => {
    let expected = [new Token(INT, '123', '123', 1), eof()]
    let source = '123'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('123_', () => {
    let expected = [new Token(INT, '123_', '123', 1), eof()]
    let source = '123_'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('123.45', () => {
    let expected = [new Token(FLOAT, '123.45', '123.45', 1), eof()]
    let source = '123.45'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('123_456', () => {
    let expected = [new Token(INT, '123_456', '123456', 1), eof()]
    let source = '123_456'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('123_456.78', () => {
    let expected = [new Token(FLOAT, '123_456.78', '123456.78', 1), eof()]
    let source = '123_456.78'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('123_456.78_90', () => {
    let expected = [new Token(FLOAT, '123_456.78_90', '123456.7890', 1), eof()]
    let source = '123_456.78_90'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('1_2_3_4_5_6_7_8_9_0', () => {
    let expected = [
      new Token(INT, '1_2_3_4_5_6_7_8_9_0', '1234567890', 1),
      eof(),
    ]
    let source = '1_2_3_4_5_6_7_8_9_0'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('0x1', () => {
    let expected = [new Token(INT, '0x1', '0x1', 1), eof()]
    let source = '0x1'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('0X12', () => {
    let expected = [new Token(INT, '0X12', '0X12', 1), eof()]
    let source = '0X12'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('0x012_345_678_9AB_CDE_F', () => {
    let expected = [
      new Token(INT, '0x012_345_678_9AB_CDE_F', '0x0123456789ABCDEF', 1),
      eof(),
    ]
    let source = '0x012_345_678_9AB_CDE_F'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('0o1', () => {
    let expected = [new Token(INT, '0o1', '0o1', 1), eof()]
    let source = '0o1'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('0O10', () => {
    let expected = [new Token(INT, '0O10', '0O10', 1), eof()]
    let source = '0O10'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('0o012_345_67', () => {
    let expected = [new Token(INT, '0o012_345_67', '0o01234567', 1), eof()]
    let source = '0o012_345_67'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('0b1', () => {
    let expected = [new Token(INT, '0b1', '0b1', 1), eof()]
    let source = '0b1'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('0B10', () => {
    let expected = [new Token(INT, '0B10', '0B10', 1), eof()]
    let source = '0B10'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('0b010_101_011', () => {
    let expected = [new Token(INT, '0b010_101_011', '0b010101011', 1), eof()]
    let source = '0b010_101_011'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })
})

describe('scan identifiers', () => {
  test('abc', () => {
    let expected = [new Token(IDENTIFIER, 'abc', undefined, 1), eof()]
    let source = 'abc'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('abc123', () => {
    let expected = [new Token(IDENTIFIER, 'abc123', undefined, 1), eof()]
    let source = 'abc123'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('_abc', () => {
    let expected = [new Token(IDENTIFIER, '_abc', undefined, 1), eof()]
    let source = '_abc'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('abc_123', () => {
    let expected = [new Token(IDENTIFIER, 'abc_123', undefined, 1), eof()]
    let source = 'abc_123'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })
})

describe('scan double quote string literals', () => {
  const doubleQuote = new Token(DOUBLE_QUOTE, '"', undefined, 1)
  const part = (text: string) => new Token(STRING_PART, text, text, 1)
  const string = (text: string) => new Token(STRING, text, text, 1)
  const basic = (value: string) => [doubleQuote, part(value), doubleQuote]
  const leftBrace = new Token(LEFT_BRACE, '{', undefined, 1)
  const rightBrace = new Token(RIGHT_BRACE, '}', undefined, 1)
  const identifier = (text: string) => new Token(IDENTIFIER, text, undefined, 1)

  test('""', () => {
    let expected = [string(''), eof()]
    let source = '""'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('"string literal"', () => {
    let expected = [string('string literal'), eof()]
    let source = '"string literal"'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test.todo('"string\\" literal"', () => {
    let expected = [...basic('"string\\" literal"'), eof()]
    let source = '"string\\" literal"'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('"string\\t literal"', () => {
    let expected = [string('string\\t literal'), eof()]
    let source = '"string\\t literal"'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('"string\\n literal"', () => {
    let expected = [string('string\\n literal'), eof()]
    let source = '"string\\n literal"'
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('"hello$world"', () => {
    let source = '"hello$world"'
    let expected = [
      doubleQuote,
      part('hello'),
      identifier('world'),
      doubleQuote,
      eof(),
    ]
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('"hello${world}"', () => {
    let source = '"hello${world}"'
    let expected = [
      doubleQuote,
      part('hello'),
      leftBrace,
      identifier('world'),
      rightBrace,
      doubleQuote,
      eof(),
    ]
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('"he${ll}o${wo}${rl}d"', () => {
    let source = '"he${ll}o${wo}${rl}d"'
    let expected = [
      doubleQuote,
      part('he'),
      leftBrace,
      identifier('ll'),
      rightBrace,
      part('o'),
      leftBrace,
      identifier('wo'),
      rightBrace,
      leftBrace,
      identifier('rl'),
      rightBrace,
      part('d'),
      doubleQuote,
      eof(),
    ]
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('"hello${"${"wo" +. "rld"}"}."', () => {
    let source = '"hello${"${"wo" +. "rld"}"}."'
    let expected = [
      doubleQuote,
      part('hello'),
      leftBrace,
      doubleQuote,
      leftBrace,
      string('wo'),
      new Token(PLUS_DOT, '+.', undefined, 1),
      string('rld'),
      rightBrace,
      doubleQuote,
      rightBrace,
      part('.'),
      doubleQuote,
      eof(),
    ]
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('"1${"2${"3"}4"}5"', () => {
    let source = '"1${"2${"3"}4"}5"'
    let expected = [
      doubleQuote,
      part('1'),
      leftBrace,
      doubleQuote,
      part('2'),
      leftBrace,
      string('3'),
      rightBrace,
      part('4'),
      doubleQuote,
      rightBrace,
      part('5'),
      doubleQuote,
      eof(),
    ]
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('"$123"', () => {
    let source = '"$123"'
    let expected = [string('$123'), eof()]
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test('"{name()}"', () => {
    let source = '"{name()}"'
    let expected = [string('{name()}'), eof()]
    let actual = scan(source)
    expect(actual).toEqual(expected)
  })

  test.todo('"hello\\"world"')
  test.todo('escaped left and right braces')
  test.todo('escaped $')
})

describe.todo('scan single quote string literals', () => {})

function print(tokens: Token[]) {
  for (let token of tokens) {
    console.log(token.toString())
  }
}
