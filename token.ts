export class Token {
  constructor(
    public type: TokenType,
    public lexeme: string,
    public literal: any,
    public line: number,
  ) {}

  public toString() {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}

export enum TokenType {
  // brackets
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACKET,
  RIGHT_BRACKET,
  LEFT_BRACE,
  RIGHT_BRACE,

  COMMA,
  DOT,
  COLON,
  QUESTION,
  AMPERSAND,
  PIPE,

  // math operators
  MINUS,
  PLUS,
  SEMICOLON,
  SLASH,
  STAR,
  PLUS_PLUS,
  MINUS_MINUS,
  STAR_STAR,
  PERCENT,

  // assignment operators
  EQUAL,
  PLUS_EQUAL,
  MINUS_EQUAL,
  STAR_EQUAL,
  SLASH_EQUAL,
  STAR_STAR_EQUAL,
  PERCENT_EQUAL,
  NULL_COALESCE_EQUAL,
  LOGICAL_OR_EQUAL,

  // comparison operators
  BANG_EQUAL,
  BANG_EQUAL_EQUAL,
  EQUAL_EQUAL,
  EQUAL_EQUAL_EQUAL,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL,
  SPACESHIP,

  // >= 2 character tokens
  ARROW, // =>
  BANG,
  COLON_COLON,
  LOGICAL_AND,
  LOGICAL_OR,
  NULL_COALESCE,
  ELVIS, // a ?: b
  OPTIONAL_CHAIN, // a?.b

  // Literals
  IDENTIFIER,
  STRING,
  NUMBER,

  // Keywords
  ABSTRACT,
  AS,
  CATCH,
  CLASS,
  CONST,
  DEFAULT,
  ECHO,
  ELSE,
  EXTENDS,
  FALSE,
  FINAL,
  FINALLY,
  FOREACH,
  FOR,
  FUN,
  IF,
  IMPLEMENTS,
  MATCH,
  NEW,
  NULL,
  PRIVATE,
  PROTECTED,
  PUBLIC,
  READONLY,
  RETURN,
  STATIC,
  SUPER,
  THIS,
  THROW,
  TRUE,
  TRY,
  VAL,
  VAR,
  WHILE,

  EOF,
}
