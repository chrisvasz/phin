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

  // Literals
  IDENTIFIER,
  STRING,
  NUMBER,

  // Keywords
  CLASS,
  ECHO,
  ELSE,
  FALSE,
  FUN,
  FOR,
  IF,
  MATCH,
  NULL,
  RETURN,
  SUPER,
  THIS,
  TRUE,
  VAL,
  VAR,
  WHILE,

  EOL,
  EOF,
}
