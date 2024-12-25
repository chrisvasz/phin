import { Token, TokenType } from './token';
import * as stmt from './stmt';
import { Stmt } from './stmt';
import * as expr from './expr';
import { Expr } from './expr';
import * as types from './type';
import { Type } from './type';

const {
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
  EOF,
  EQUAL_EQUAL_EQUAL,
  EQUAL_EQUAL,
  EQUAL,
  EXTENDS,
  FALSE,
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
  READONLY,
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
const terminators = [SEMICOLON, EOF]; // TODO drop this

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
      if (match(TRY)) return tryDeclaration();
      if (match(THROW)) return throwDeclaration();
      if (match(CLASS)) return classDeclaration();
      if (match(FUN)) return functionDeclaration();
      if (match(VAR)) return varDeclaration();
      return statement();
    } catch (error) {
      if (!(error instanceof ParseError)) throw error;
      synchronize();
      return null;
    }
  }

  function tryDeclaration(): Stmt | null {
    consume('Expect "{" before try body', LEFT_BRACE);
    return new stmt.Try(block(), tryCatches(), tryFinally());
  }

  function tryCatches(): stmt.Catch[] {
    let catches: stmt.Catch[] = [];
    while (match(CATCH)) {
      consume('Expect "(" after catch', LEFT_PAREN);
      let name = consume('Expect variable name', IDENTIFIER).lexeme;
      consume('Expect ":" after catch variable', COLON);
      let types = tryCatchTypes();
      consume('Expect ")" after catch', RIGHT_PAREN);
      consume('Expect "{" before catch body', LEFT_BRACE);
      let body = block();
      catches.push(new stmt.Catch(name, types, body));
    }
    return catches;
  }

  function tryCatchTypes(): string[] {
    let types = [consume('Expect exception type', IDENTIFIER).lexeme];
    while (match(PIPE)) {
      types.push(consume('Expect exception type', IDENTIFIER).lexeme);
    }
    return types;
  }

  function tryFinally(): Stmt[] | null {
    if (!match(FINALLY)) return null;
    consume('Expect "{" before finally body', LEFT_BRACE);
    return block();
  }

  function throwDeclaration(): stmt.Throw {
    return new stmt.Throw(expression());
  }

  function classDeclaration(): stmt.Class {
    let name = consume('Expect class name', IDENTIFIER).lexeme;
    let params = match(LEFT_PAREN) ? classParams() : [];
    let superclass = match(EXTENDS) ? classSuperclass() : null;
    let interfaces = match(IMPLEMENTS) ? classInterfaces() : [];
    consume('Expect "{" before class body', LEFT_BRACE);
    let members = classMembers();
    consume('Expect "}" after class body', RIGHT_BRACE);
    return new stmt.Class(name, params, superclass, interfaces, members);
  }

  function classParams(): stmt.ClassParam[] {
    let params: stmt.ClassParam[] = [];
    if (!check(RIGHT_PAREN)) {
      params.push(classParam());
      while (match(COMMA)) {
        if (check(RIGHT_PAREN)) break; // support trailing commas
        params.push(classParam());
      }
    }
    consume('Expect ")" after class params', RIGHT_PAREN);
    return params;
  }

  function classParam(): stmt.ClassParam {
    let isFinal = match(FINAL);
    let visibility = classVisibility();
    let isReadonly = match(READONLY);
    let name = consume('Expect class param name', IDENTIFIER).lexeme;
    let type = match(COLON) ? typeAnnotation() : null;
    let initializer = match(EQUAL) ? expression() : null;
    return new stmt.ClassParam(
      name,
      type,
      initializer,
      visibility,
      isFinal,
      isReadonly,
    );
  }

  function classSuperclass(): stmt.ClassSuperclass {
    let name = consume('Expect superclass name', IDENTIFIER).lexeme;
    let args: Expr[] = [];
    if (match(LEFT_PAREN)) {
      args.push(expression());
      while (match(COMMA)) {
        if (check(RIGHT_PAREN)) break; // support trailing commas
        args.push(expression());
      }
      consume('Expect ")" after superclass arguments', RIGHT_PAREN);
    }
    return new stmt.ClassSuperclass(name, args);
  }

  function classInterfaces(): string[] {
    let interfaces = [consume('Expect interface name', IDENTIFIER).lexeme];
    while (match(COMMA)) {
      if (check(RIGHT_BRACE)) break; // support trailing commas
      interfaces.push(consume('Expect interface name', IDENTIFIER).lexeme);
    }
    return interfaces;
  }

  function classMembers(): Array<ReturnType<typeof classMember>> {
    let members: Array<ReturnType<typeof classMember>> = [];
    while (!check(RIGHT_BRACE) && !isAtEnd()) {
      members.push(classMember());
      match(SEMICOLON); // support trailing semicolon
    }
    return members;
  }

  function classMember():
    | stmt.ClassMethod
    | stmt.ClassProperty
    | stmt.ClassConst
    | stmt.ClassInitializer {
    let isFinal = match(FINAL);
    let visibility = classVisibility();
    let isStatic = match(STATIC);
    if (match(FUN)) return classMethod(visibility, isStatic, isFinal);
    if (match(VAR)) return classProperty(visibility, isStatic, isFinal);
    if (match(CONST)) return classConst(visibility, isStatic, isFinal);
    if (matchIdentifier('init')) return classInitializer();
    throw error(peek(), 'Expect class member');
  }

  function classVisibility(): stmt.Visibility {
    let token = match(PUBLIC, PROTECTED, PRIVATE) ? previous() : null;
    if (token === null) return null;
    if (token.type === PUBLIC) return 'public';
    if (token.type === PROTECTED) return 'protected';
    if (token.type === PRIVATE) return 'private';
    return null;
  }

  function classMethod(
    visibility: stmt.Visibility,
    isStatic: boolean,
    isFinal: boolean,
  ): stmt.ClassMethod {
    return new stmt.ClassMethod(
      functionDeclaration(),
      visibility,
      isStatic,
      isFinal,
    );
  }

  function classProperty(
    visibility: stmt.Visibility,
    isStatic: boolean,
    isFinal: boolean,
  ): stmt.ClassProperty {
    return new stmt.ClassProperty(
      varDeclaration(),
      visibility,
      isStatic,
      isFinal,
    );
  }

  function classConst(
    visibility: stmt.Visibility,
    isStatic: boolean,
    isFinal: boolean,
  ): stmt.ClassConst {
    let name = consume('Expect class constant name', IDENTIFIER).lexeme;
    let type = match(COLON) ? typeAnnotation() : null;
    consume('Expect "=" after class constant name', EQUAL);
    let initializer = expression();
    return new stmt.ClassConst(
      name,
      type,
      initializer,
      visibility,
      isStatic,
      isFinal,
    );
  }

  function classInitializer(): stmt.ClassInitializer {
    consume('Expect "{" before class initializer body', LEFT_BRACE);
    return new stmt.ClassInitializer(block());
  }

  function functionDeclaration(): stmt.Function {
    let name = consume('Expect function name', IDENTIFIER).lexeme;
    consume('Expect "(" after function name', LEFT_PAREN);
    let params = functionParams();
    let returnType = match(COLON) ? typeAnnotation() : null;
    return new stmt.Function(name, params, returnType, functionBody());
  }

  function functionExpression(): expr.Function {
    consume('Expect "(" after function name', LEFT_PAREN);
    let params = functionParams();
    let returnType = match(COLON) ? typeAnnotation() : null;
    return new expr.Function(params, returnType, functionBody());
  }

  function functionParams(): stmt.Var[] {
    let params: stmt.Var[] = [];
    if (!check(RIGHT_PAREN)) {
      params.push(functionParam());
      while (match(COMMA)) {
        if (check(RIGHT_PAREN)) break; // support trailing commas
        params.push(functionParam());
      }
    }
    consume('Expect ")" after function params', RIGHT_PAREN);
    return params;
  }

  function functionParam(): stmt.Var {
    let name = consume('Expect parameter name', IDENTIFIER).lexeme;
    let type = match(COLON) ? typeAnnotation() : null;
    let initializer = match(EQUAL) ? expression() : null;
    return new stmt.Var(name, type, initializer);
  }

  function functionBody(): Expr | Stmt[] {
    if (match(ARROW)) return expression();
    if (match(LEFT_BRACE)) return block();
    throw error(peek(), 'Expect "=>" or "{" before function body');
  }

  function varDeclaration(): stmt.Var {
    let result = varWithType();
    let initializer = match(EQUAL) ? expression() : null;
    consume('Expect terminator after variable declaration', ...terminators);
    return new stmt.Var(result.name, result.type, initializer);
  }

  function varWithType(): stmt.Var {
    let name = consume('Expect variable name', IDENTIFIER).lexeme;
    let type = match(COLON) ? typeAnnotation() : null;
    return new stmt.Var(name, type, null);
  }

  function statement(): Stmt {
    if (match(FOREACH)) return foreachStatement();
    if (match(FOR)) return forStatement();
    if (match(IF)) return ifStatement();
    if (match(WHILE)) return whileStatement();
    if (match(ECHO)) return echoStatement();
    if (match(RETURN)) return new stmt.Return(expression());
    if (match(LEFT_BRACE)) return new stmt.Block(block());
    return expressionStatement();
  }

  function foreachStatement(): Stmt {
    consume('Expect "(" after "foreach"', LEFT_PAREN);
    let iterable = expression();
    consume('Expect "as" after foreach iterable expression', AS);
    let key: stmt.Var | null = null;
    let value = varWithType();
    if (match(ARROW)) {
      key = value;
      value = varWithType();
    }
    consume('Expect ")" after foreach expression', RIGHT_PAREN);
    let body = statement();
    return new stmt.Foreach(key, value, iterable, body);
  }

  function forStatement(): Stmt {
    consume('Expect "(" after "for"', LEFT_PAREN);
    let initializer = forInitializer();
    let condition = forCondition();
    let increment = forIncrement();
    consume('Expect ")" after for clauses', RIGHT_PAREN);
    let body = statement();
    return new stmt.For(initializer, condition, increment, body);
  }

  function forInitializer(): Stmt | null {
    if (match(SEMICOLON)) return null;
    if (match(VAR)) return varDeclaration();
    return expressionStatement();
  }

  function forCondition(): Expr | null {
    if (match(SEMICOLON)) return null;
    let result = expression();
    consume('Expect ";" after loop condition', SEMICOLON);
    return result;
  }

  function forIncrement(): Expr | null {
    if (check(RIGHT_PAREN)) return null;
    return expression();
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
    return new stmt.Echo(result);
  }

  function whileStatement(): Stmt {
    consume('Expect "(" after "while"', LEFT_PAREN);
    let condition = expression();
    consume('Expect ")" after while condition', RIGHT_PAREN);
    let body = statement();
    return new stmt.While(condition, body);
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
    if (match(FUN)) return functionExpression();
    if (match(NEW)) return newExpression();
    if (match(MATCH)) return matchExpression();
    if (match(THROW)) return throwExpression();
    return assignment();
  }

  function newExpression(): Expr {
    return new expr.New(expression());
  }

  function matchExpression(): expr.Match {
    consume('Expect "(" after "match"', LEFT_PAREN);
    let subject = expression();
    consume('Expect ")" after match subject', RIGHT_PAREN);
    consume('Expect "{" before match body', LEFT_BRACE);
    let arms = matchArms();
    let defaultArm = matchDefaultArm();
    consume('Expect "}" after match body', RIGHT_BRACE);
    return new expr.Match(subject, arms, defaultArm);
  }

  function matchArms(): expr.MatchArm[] {
    let arms: expr.MatchArm[] = [];
    while (!check(RIGHT_BRACE) && !check(DEFAULT) && !isAtEnd()) {
      arms.push(matchArm());
    }
    return arms;
  }

  function matchArm(): expr.MatchArm {
    let patterns: Expr[] = [expression()];
    while (match(COMMA)) {
      if (check(ARROW)) break; // support trailing commas
      patterns.push(expression());
    }
    consume('Expect "=>" after match patterns', ARROW);
    let body = expression();
    match(COMMA); // optional trailing comma
    return new expr.MatchArm(patterns, body);
  }

  function matchDefaultArm(): Expr | null {
    if (!match(DEFAULT)) return null;
    consume('Expect "=>" after "default"', ARROW);
    let result = expression();
    match(COMMA); // optional trailing comma
    return result;
  }

  function throwExpression(): Expr {
    return new expr.Throw(expression());
  }

  function assignment(): Expr {
    let result = logicalOr();
    if (match(EQUAL)) {
      let equals = previous();
      let value = assignment();
      if (result instanceof expr.Identifier) {
        return new expr.Assign(result.name, value);
      }
      throw error(equals, 'Invalid assignment target');
    }
    return result;
  }

  function logicalOr(): Expr {
    let result = logicalAnd();
    while (match(LOGICAL_OR)) {
      let operator = previous();
      let right = logicalAnd();
      result = new expr.Binary(result, operator.lexeme, right);
    }
    return result;
  }

  function logicalAnd(): Expr {
    let result = equality();
    while (match(LOGICAL_AND)) {
      let operator = previous();
      let right = equality();
      result = new expr.Binary(result, operator.lexeme, right);
    }
    return result;
  }

  function equality(): Expr {
    let result = comparison();
    while (
      match(BANG_EQUAL, EQUAL_EQUAL, BANG_EQUAL_EQUAL, EQUAL_EQUAL_EQUAL)
    ) {
      let operator = previous();
      let right = comparison();
      result = new expr.Binary(result, operator.lexeme, right);
    }
    return result;
  }

  function comparison(): Expr {
    let result = term();
    while (match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL, SPACESHIP)) {
      let operator = previous();
      let right = term();
      result = new expr.Binary(result, operator.lexeme, right);
    }
    return result;
  }

  function term(): Expr {
    let result = factor();
    while (match(MINUS, PLUS)) {
      let operator = previous();
      let right = factor();
      result = new expr.Binary(result, operator.lexeme, right);
    }
    return result;
  }

  function factor(): Expr {
    let result = unary();
    while (match(SLASH, STAR)) {
      let operator = previous();
      let right = unary();
      result = new expr.Binary(result, operator.lexeme, right);
    }
    return result;
  }

  function unary(): Expr {
    if (match(BANG, MINUS, PLUS)) {
      let operator = previous();
      let right = unary();
      return new expr.Unary(operator.lexeme, right);
    }
    return prefix();
  }

  function prefix(): Expr {
    if (match(PLUS_PLUS, MINUS_MINUS)) {
      let operator = previous();
      let right = consume('Expect identifier after unary operator', IDENTIFIER);
      return new expr.Prefix(
        operator.lexeme,
        new expr.Identifier(right.lexeme),
      );
    }
    return call();
  }

  function call(): Expr {
    let ex = primary();
    while (true) {
      if (match(LEFT_PAREN)) {
        ex = new expr.Call(ex, callArgs());
      } else if (match(DOT)) {
        ex = getExpression(ex);
      } else if (match(OPTIONAL_CHAIN)) {
        ex = optionalGetExpression(ex);
      } else break;
    }
    return ex;
  }

  function callArgs(): Expr[] {
    let args: Expr[] = [];
    if (match(RIGHT_PAREN)) return args;
    args.push(expression());
    while (match(COMMA)) {
      if (check(RIGHT_PAREN)) break; // support trailing commas
      args.push(expression());
    }
    consume('Expect ")" after arguments', RIGHT_PAREN);
    return args;
  }

  function getExpression(receiver: Expr): expr.Get {
    let name = consume('Expect property name after .', IDENTIFIER).lexeme;
    return new expr.Get(receiver, name);
  }

  function optionalGetExpression(receiver: Expr): expr.Get {
    let name = consume('Expect property name after ?.', IDENTIFIER).lexeme;
    return new expr.OptionalGet(receiver, name);
  }

  function primary(): Expr {
    if (match(NULL)) return new expr.NullLiteral();
    if (match(NUMBER)) return numberLiteral();
    if (match(STRING)) return stringLiteral();
    if (match(TRUE)) return new expr.BooleanLiteral(true);
    if (match(FALSE)) return new expr.BooleanLiteral(false);
    if (match(LEFT_PAREN)) return grouping();
    if (match(LEFT_BRACKET)) return arrayLiteral();
    if (match(THIS)) return new expr.This();
    if (match(SUPER)) return new expr.Super();
    if (match(IDENTIFIER)) return identifier();
    throw error(peek(), 'Expect expression');
  }

  function numberLiteral() {
    return new expr.NumberLiteral(previous().literal);
  }

  function stringLiteral() {
    return new expr.StringLiteral(previous().literal);
  }

  function grouping(): Expr {
    let result = expression();
    consume('Expect ")" after expression', RIGHT_PAREN);
    return new expr.Grouping(result);
  }

  function arrayLiteral(): expr.ArrayLiteral {
    let elements = arrayElements();
    consume('Expect "]" after array literal', RIGHT_BRACKET);
    return new expr.ArrayLiteral(elements);
  }

  function arrayElements(): expr.ArrayElement[] {
    let elements: expr.ArrayElement[] = [];
    while (!check(RIGHT_BRACKET) && !isAtEnd()) {
      elements.push(arrayElement());
      match(COMMA);
    }
    return elements;
  }

  function arrayElement(): expr.ArrayElement {
    return new expr.ArrayElement(arrayKey(), expression());
  }

  function identifier(): expr.Identifier {
    return new expr.Identifier(previous().lexeme);
  }

  function arrayKey(): expr.NumberLiteral | expr.StringLiteral | null {
    if (check(NUMBER, STRING) && checkNext(ARROW)) {
      try {
        if (match(NUMBER)) return numberLiteral();
        if (match(STRING)) return stringLiteral();
      } finally {
        match(ARROW);
      }
    }
    return null;
  }

  function typeAnnotation(): Type {
    if (match(QUESTION)) return typeNullable();
    let first = type();
    if (check(PIPE)) return typeUnion(first);
    if (check(AMPERSAND)) return typeIntersection(first);
    return first;
  }

  function typeUnion(first: Type): Type {
    let elements = [first];
    while (match(PIPE)) {
      elements.push(type());
    }
    return new types.Union(elements);
  }

  function typeIntersection(first: Type): Type {
    let elements = [first];
    while (match(AMPERSAND)) {
      elements.push(type());
    }
    if (elements.length === 1) return elements[0];
    return new types.Intersection(elements);
  }

  function typeNullable(): Type {
    return new types.Nullable(type());
  }

  function type(): Type {
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
    if (lexeme === 'bool') return new types.Boolean();
    if (lexeme === 'int') return new types.Int();
    if (lexeme === 'float') return new types.Float();
    return new types.Identifier(lexeme, typeGenerics());
  }

  function typeGenerics(): Type[] {
    let generics: Type[] = [];
    if (match(LESS)) {
      generics.push(typeGeneric());
      while (match(COMMA)) {
        if (check(GREATER)) break; // support trailing commas
        generics.push(typeGeneric());
      }
      consume('Expect ">" after type generics', GREATER);
    }
    return generics;
  }

  function typeGeneric(): Type {
    return typeAnnotation();
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

  function matchIdentifier(name: string): boolean {
    if (peek().type === IDENTIFIER && peek().lexeme === name) {
      advance();
      return true;
    }
    return false;
  }

  function consume(message: string, ...anyOf: TokenType[]): Token {
    for (let type of anyOf) {
      if (check(type)) {
        return advance();
      }
    }
    throw error(peek(), message);
  }

  function error(token: Token, message: string): Error {
    return new ParseError(`[line ${token.line}] Error${token}: ${message}`);
  }

  function check(...anyOf: TokenType[]): boolean {
    if (isAtEnd()) return anyOf.includes(EOF);
    return anyOf.includes(peek().type);
  }

  function checkNext(type: TokenType): boolean {
    if (isAtEnd()) return type === EOF;
    return peekNext().type === type;
  }

  function advance(): Token {
    let result = peek();
    if (!isAtEnd()) current++;
    return result;
  }

  function isAtEnd(): boolean {
    return peek().type === EOF;
  }

  function peek(): Token {
    return tokens[current];
  }

  function peekNext(): Token {
    if (isAtEnd()) return peek();
    return tokens[current + 1];
  }

  function previous(): Token {
    return tokens[current - 1];
  }
}
