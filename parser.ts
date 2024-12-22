import { Token, TokenType } from './Token';
import * as stmt from './stmt';
import { Stmt } from './stmt';
import * as expr from './expr';
import { Expr } from './expr';
import * as types from './type';
import { Type } from './type';

const {
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACE,
  RIGHT_BRACE,
  COMMA,
  DOT,
  COLON,
  COLON_COLON,
  QUESTION,
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
  EOL,
  EOF,
} = TokenType;
const terminators = [SEMICOLON, EOL, EOF];

class ParseError extends Error {}

export default function parse(tokens: Token[]): Stmt[] {
  let current = 0;
  return parse();

  function parse(): Stmt[] {
    const statements: Stmt[] = [];
    while (!isAtEnd()) {
      const next = declaration();
      if (next) statements.push(next);
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

  function declaration(): Stmt | null {
    try {
      if (match(VAR)) return varDeclaration();
      return statement();
    } catch (error) {
      if (!(error instanceof ParseError)) throw error;
      synchronize();
      return null;
    }
  }

  function varDeclaration(): Stmt {
    let name = consume('Expect variable name', IDENTIFIER);
    let initializer: Expr | null = null;
    let typeDefinition: Type | null = null;
    if (match(COLON)) {
      typeDefinition = type();
    }
    if (match(EQUAL)) {
      initializer = expression();
    }
    consume('Expect terminator after variable declaration', ...terminators);
    return new stmt.Var(name, initializer, typeDefinition);
  }

  function statement(): Stmt {
    if (match(IF)) return ifStatement();
    if (match(ECHO)) return echoStatement();
    if (match(LEFT_BRACE)) return new stmt.Block(block());
    return expressionStatement();
  }

  function ifStatement(): Stmt {
    consume('Expect "(" after "if"', LEFT_PAREN);
    let condition = expression();
    consume('Expect ")" after if condition', RIGHT_PAREN);
    let thenBranch = statement();
    let elseBranch: Stmt | null = null;
    if (match(ELSE)) {
      elseBranch = statement();
    }
    return new stmt.If(condition, thenBranch, elseBranch);
  }

  function echoStatement(): Stmt {
    let result = expression();
    consume('Expect terminator after echo statement', ...terminators);
    return new stmt.Expression(result);
  }

  function block(): Stmt[] {
    const statements: Stmt[] = [];
    while (!check(RIGHT_BRACE) && !isAtEnd()) {
      const next = declaration();
      if (next) statements.push(next);
    }
    consume('Expect "}" after block', RIGHT_BRACE);
    return statements;
  }

  function expressionStatement(): Stmt {
    let result = expression();
    consume('Expect terminator after expression statement', ...terminators);
    return new stmt.Expression(result);
  }

  function expression(): Expr {
    return assignment();
  }

  function assignment(): Expr {
    let result = equality();
    if (match(EQUAL)) {
      let equals = previous();
      let value = assignment();
      if (result instanceof expr.Variable) {
        return new expr.Assign(result.name, value);
      }
      throw error(equals, 'Invalid assignment target');
    }
    return result;
  }

  function equality(): Expr {
    let result = comparison();
    while (match(BANG_EQUAL, EQUAL_EQUAL)) {
      let operator = previous();
      let right = comparison();
      result = new expr.Binary(result, operator, right);
    }
    return result;
  }

  function comparison(): Expr {
    let result = term();
    while (match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL)) {
      let operator = previous();
      let right = term();
      result = new expr.Binary(result, operator, right);
    }
    return result;
  }

  function term(): Expr {
    let result = factor();
    while (match(MINUS, PLUS)) {
      let operator = previous();
      let right = factor();
      result = new expr.Binary(result, operator, right);
    }
    return result;
  }

  function factor(): Expr {
    let result = unary();
    while (match(SLASH, STAR)) {
      let operator = previous();
      let right = unary();
      result = new expr.Binary(result, operator, right);
    }
    return result;
  }

  function unary(): Expr {
    if (match(BANG, MINUS)) {
      let operator = previous();
      let right = unary();
      return new expr.Unary(operator, right);
    }
    return primary();
  }

  function primary(): Expr {
    if (match(NULL)) return new expr.NullLiteral();
    if (match(NUMBER)) return new expr.NumberLiteral(previous().literal);
    if (match(STRING)) return new expr.StringLiteral(previous().literal);
    if (match(TRUE)) return new expr.BooleanLiteral(true);
    if (match(FALSE)) return new expr.BooleanLiteral(false);
    if (match(LEFT_PAREN)) return grouping();
    if (match(IDENTIFIER)) return new expr.Variable(previous());
    throw error(peek(), 'Expect expression');
  }

  function grouping(): Expr {
    let result = expression();
    consume('Expect ")" after expression', RIGHT_PAREN);
    return new expr.Grouping(result);
  }

  function type(): Type {
    if (match(QUESTION)) return new types.Nullable(type());
    if (match(NULL)) return new types.Null();
    if (match(NUMBER)) return new types.NumberLiteral(previous().literal);
    if (match(STRING)) return new types.StringLiteral(previous().literal);
    if (match(TRUE)) return new types.True();
    if (match(FALSE)) return new types.False();
    if (match(IDENTIFIER)) return typeIdentifier();
    throw error(peek(), 'Expect type annotation');
  }

  function typeIdentifier(): Type {
    let lexeme = previous().lexeme;
    if (lexeme === 'number') return new types.Number();
    if (lexeme === 'string') return new types.String();
    if (lexeme === 'boolean') return new types.Boolean();
    let generic: Type | null = null;
    if (match(LESS)) {
      generic = type();
      consume('Expect ">" after generic type', GREATER);
    }
    return new types.Identifier(lexeme, generic);
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
