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
  // Single-character tokens
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
  MINUS,
  PLUS,
  SEMICOLON,
  SLASH,
  STAR,

  // >= 2 character tokens
  ARROW, // =>
  PLUS_PLUS,
  MINUS_MINUS,
  BANG,
  BANG_EQUAL,
  BANG_EQUAL_EQUAL,
  EQUAL,
  EQUAL_EQUAL,
  EQUAL_EQUAL_EQUAL,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL,
  COLON_COLON,
  LOGICAL_AND,
  LOGICAL_OR,
  SPACESHIP,
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