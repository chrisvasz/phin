import {
  Binary,
  BooleanLiteral,
  Expr,
  ExpressionStatement,
  Grouping,
  NullLiteral,
  NumberLiteral,
  Stmt,
  StringLiteral,
  Unary,
} from './nodes';
import { Token, TokenType } from './Token';

const {
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACE,
  RIGHT_BRACE,
  COMMA,
  DOT,
  MINUS,
  PLUS,
  SEMICOLON,
  SLASH,
  STAR,
  BANG,
  BANG_EQUAL,
  EQUAL,
  EQUAL_EQUAL,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL,
  IDENTIFIER,
  STRING,
  NUMBER,
  CLASS,
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
  EOL,
  EOF,
} = TokenType;

class ParseError extends Error {}

export default function parse(tokens: Token[]): Stmt[] {
  let current = 0;
  return parse();

  function parse(): Stmt[] {
    const statements: Stmt[] = [];
    while (!isAtEnd()) {
      statements.push(statement());
    }
    return statements;
  }

  function synchronize(): void {
    advance();
    while (!isAtEnd()) {
      if (previous().type === SEMICOLON) return;
      switch (peek().type) {
        case CLASS:
        case FUN:
        case VAR:
        case VAL:
        case FOR:
        case IF:
        case RETURN:
          return;
      }
      advance();
    }
  }

  function statement(): Stmt {
    return expressionStatement();
  }

  function expressionStatement(): Stmt {
    let expr = expression();
    consume(
      'Expect terminator after expression statement.',
      SEMICOLON,
      EOL,
      EOF,
    );
    return new ExpressionStatement(expr);
  }

  function expression(): Expr {
    return equality();
  }

  function equality(): Expr {
    let expr = comparison();
    while (match(BANG_EQUAL, EQUAL_EQUAL)) {
      let operator = previous();
      let right = comparison();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }

  function comparison(): Expr {
    let expr = term();
    while (match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL)) {
      let operator = previous();
      let right = term();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }

  function term(): Expr {
    let expr = factor();
    while (match(MINUS, PLUS)) {
      let operator = previous();
      let right = factor();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }

  function factor(): Expr {
    let expr = unary();
    while (match(SLASH, STAR)) {
      let operator = previous();
      let right = unary();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }

  function unary(): Expr {
    if (match(BANG, MINUS)) {
      let operator = previous();
      let right = unary();
      return new Unary(operator, right);
    }
    return primary();
  }

  function primary(): Expr {
    if (match(FALSE)) return new BooleanLiteral(false);
    if (match(TRUE)) return new BooleanLiteral(true);
    if (match(NULL)) return new NullLiteral();
    if (match(NUMBER)) return new NumberLiteral(previous().literal);
    if (match(STRING)) return new StringLiteral(previous().literal);
    if (match(LEFT_PAREN)) {
      let expr = expression();
      consume('Expect ")" after expression.', RIGHT_PAREN);
      return new Grouping(expr);
    }
    throw error(peek(), 'Expect expression.');
  }

  function match(...types: TokenType[]): boolean {
    for (let type of types) {
      if (check(type)) {
        advance();
        return true;
      }
    }
    return false;
  }

  function consume(message: string, ...types: TokenType[]): Token {
    for (let type of types) {
      if (check(type)) {
        return advance();
      }
    }
    throw error(peek(), message);
  }

  function error(token: Token, message: string): Error {
    return new ParseError(`[line ${token.line}] Error${token}: ${message}`);
  }

  function check(type: TokenType): boolean {
    if (isAtEnd()) return type === EOF;
    return peek().type === type;
  }

  function advance(): Token {
    if (!isAtEnd()) current++;
    return previous();
  }

  function isAtEnd(): boolean {
    return peek().type === EOF;
  }

  function peek(): Token {
    return tokens[current];
  }

  function previous(): Token {
    return tokens[current - 1];
  }
}
