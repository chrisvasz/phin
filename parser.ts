import { Token, TokenType } from './token'
import { Node, Expr, Stmt } from './nodes'
import * as nodes from './nodes'
import * as types from './types'
import { Type } from './types'

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
  INSTANCEOF,
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
  STAR_STAR_EQUAL,
  STAR_STAR,
  STAR_EQUAL,
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
} = TokenType

class ParseError extends Error {}

export default function parse(tokens: Token[]): Stmt[] {
  let current = 0
  return parse()

  function parse(): Stmt[] {
    const statements: Stmt[] = []
    while (!isAtEnd()) {
      const next = declaration()
      if (next) statements.push(next)
    }
    return statements
  }

  function synchronize(): void {
    advance()
    while (!isAtEnd()) {
      if (previous().type === SEMICOLON) return
      switch (peek().type) {
        case CLASS:
        case FUN:
        case VAR:
        case VAL:
        case FOR:
        case IF:
        case RETURN:
          return
      }
      advance()
    }
  }

  function declaration(): Stmt | null {
    try {
      if (match(TRY)) return tryDeclaration()
      if (match(THROW)) return throwDeclaration()
      if (match(CLASS)) return classDeclaration()
      if (match(FUN)) return functionDeclaration()
      if (match(VAR)) return varDeclaration()
      if (match(ABSTRACT)) {
        consume('Expect "class" after "abstract"', CLASS)
        return classDeclaration(true)
      }
      return statement()
    } catch (error) {
      if (!(error instanceof ParseError)) throw error
      synchronize()
      return null
    }
  }

  function tryDeclaration(): nodes.Try | null {
    consume('Expect "{" before try body', LEFT_BRACE)
    return new nodes.Try(block(), tryCatches(), tryFinally())
  }

  function tryCatches(): nodes.Catch[] {
    let catches: nodes.Catch[] = []
    while (match(CATCH)) {
      consume('Expect "(" after catch', LEFT_PAREN)
      let name = consume('Expect variable name', IDENTIFIER).lexeme
      consume('Expect ":" after catch variable', COLON)
      let types = tryCatchTypes()
      consume('Expect ")" after catch', RIGHT_PAREN)
      consume('Expect "{" before catch body', LEFT_BRACE)
      let body = block()
      catches.push(new nodes.Catch(name, types, body))
    }
    return catches
  }

  function tryCatchTypes(): string[] {
    let types = [consume('Expect exception type', IDENTIFIER).lexeme]
    while (match(PIPE)) {
      types.push(consume('Expect exception type', IDENTIFIER).lexeme)
    }
    return types
  }

  function tryFinally(): nodes.Block | null {
    if (!match(FINALLY)) return null
    consume('Expect "{" before finally body', LEFT_BRACE)
    return block()
  }

  function throwDeclaration(): nodes.ThrowStatement {
    return new nodes.ThrowStatement(expression())
  }

  function classDeclaration(
    isAbstract: boolean = false,
  ): nodes.ClassDeclaration {
    let name = consume('Expect class name', IDENTIFIER).lexeme
    let constructorVisibility = classVisibility()
    let params = match(LEFT_PAREN) ? classParams() : []
    let superclass = match(EXTENDS) ? classSuperclass() : null
    let interfaces = match(IMPLEMENTS) ? classInterfaces() : []
    consume('Expect "{" before class body', LEFT_BRACE)
    let members = classMembers()
    consume('Expect "}" after class body', RIGHT_BRACE)
    return new nodes.ClassDeclaration(
      name,
      constructorVisibility,
      params,
      superclass,
      interfaces,
      members,
      isAbstract,
    )
  }

  function classParams(): nodes.ClassParam[] {
    if (match(RIGHT_PAREN)) return []
    let params = [classParam()]
    while (match(COMMA)) {
      if (check(RIGHT_PAREN)) break // support trailing commas
      params.push(classParam())
    }
    consume('Expect ")" after class params', RIGHT_PAREN)
    return params
  }

  function classParam(): nodes.ClassParam {
    let isFinal = match(FINAL)
    let [visibility, isReadonly] = classParamModifierSugar()
    let name = consume('Expect class param name', IDENTIFIER).lexeme
    let type = match(COLON) ? typeAnnotation() : null
    let initializer = match(EQUAL) ? expression() : null
    return new nodes.ClassParam(
      isFinal,
      visibility,
      isReadonly,
      name,
      type,
      initializer,
    )
  }

  function classParamModifierSugar(): [nodes.Visibility, boolean] {
    if (match(PLUS)) return ['public', true]
    if (match(MINUS)) return ['private', true]
    return [classVisibility(), match(READONLY)]
  }

  function classSuperclass(): nodes.ClassSuperclass {
    let name = consume('Expect superclass name', IDENTIFIER).lexeme
    let args = match(LEFT_PAREN) ? classSuperclassArgs() : []
    return new nodes.ClassSuperclass(name, args)
  }

  function classSuperclassArgs(): Expr[] {
    if (match(RIGHT_PAREN)) return []
    let args = [expression()]
    while (match(COMMA)) {
      if (check(RIGHT_PAREN)) break // support trailing commas
      args.push(expression())
    }
    consume('Expect ")" after superclass arguments', RIGHT_PAREN)
    return args
  }

  function classInterfaces(): string[] {
    let interfaces = [consume('Expect interface name', IDENTIFIER).lexeme]
    while (match(COMMA)) {
      if (check(RIGHT_BRACE)) break // support trailing commas
      interfaces.push(consume('Expect interface name', IDENTIFIER).lexeme)
    }
    return interfaces
  }

  function classMembers(): nodes.ClassMember[] {
    let members: nodes.ClassMember[] = []
    while (!check(RIGHT_BRACE) && !isAtEnd()) {
      members.push(classMember())
      match(SEMICOLON) // support trailing semicolon
    }
    return members
  }

  function classMember(): nodes.ClassMember {
    if (match(ABSTRACT)) return abstractClassMember()
    let isFinal = match(FINAL)
    let visibility = classVisibility()
    let isStatic = match(STATIC)
    if (match(FUN)) return classMethod(isFinal, visibility, isStatic)
    if (match(VAR)) return classProperty(isFinal, visibility, isStatic)
    if (matchIdentifier('init')) return classInitializer()
    if (match(CONST)) return classConst(isFinal, visibility, isStatic)
    throw error(peek(), 'Expect class member')
  }

  function abstractClassMember(): nodes.ClassAbstractMethod {
    let visibility = classVisibility()
    let isStatic = match(STATIC)
    consume('Expect class method declaration', FUN)
    return abstractClassMethod(visibility, isStatic)
  }

  function abstractClassMethod(
    visibility: nodes.Visibility,
    isStatic: boolean,
  ): nodes.ClassAbstractMethod {
    let name = consume('Expect method name', IDENTIFIER).lexeme
    consume('Expect "(" after method name', LEFT_PAREN)
    let params = functionParams()
    let returnType = match(COLON) ? typeAnnotation() : null
    terminator()
    return new nodes.ClassAbstractMethod(
      visibility,
      isStatic,
      name,
      params,
      returnType,
    )
  }

  function classVisibility(): nodes.Visibility {
    let token = match(PUBLIC, PROTECTED, PRIVATE) ? previous() : null
    if (token === null) return null
    if (token.type === PUBLIC) return 'public'
    if (token.type === PROTECTED) return 'protected'
    if (token.type === PRIVATE) return 'private'
    return null
  }

  function classMethod(
    isFinal: boolean,
    visibility: nodes.Visibility,
    isStatic: boolean,
  ): nodes.ClassMethod {
    let fn = functionDeclaration()
    return new nodes.ClassMethod(
      isFinal,
      visibility,
      isStatic,
      fn.name,
      fn.params,
      fn.returnType,
      fn.body,
    )
  }

  function classProperty(
    isFinal: boolean,
    visibility: nodes.Visibility,
    isStatic: boolean,
  ): nodes.ClassProperty {
    let name = consume('Expect variable name', IDENTIFIER).lexeme
    let type = match(COLON) ? typeAnnotation() : null
    let initializer = match(EQUAL) ? expression() : null
    terminator()
    return new nodes.ClassProperty(
      isFinal,
      visibility,
      isStatic,
      name,
      type,
      initializer,
    )
  }

  function classConst(
    isFinal: boolean,
    visibility: nodes.Visibility,
    isStatic: boolean,
  ): nodes.ClassConst {
    let name = consume('Expect class constant name', IDENTIFIER).lexeme
    let type = match(COLON) ? typeAnnotation() : null
    consume('Expect "=" after class constant name', EQUAL)
    let initializer = expression()
    return new nodes.ClassConst(
      isFinal,
      visibility,
      isStatic,
      name,
      type,
      initializer,
    )
  }

  function classInitializer(): nodes.ClassInitializer {
    consume('Expect "{" before class initializer body', LEFT_BRACE)
    return new nodes.ClassInitializer(block())
  }

  function functionDeclaration(): nodes.FunctionDeclaration {
    let name = consume('Expect function name', IDENTIFIER).lexeme
    consume('Expect "(" after function name', LEFT_PAREN)
    let params = functionParams()
    let returnType = match(COLON) ? typeAnnotation() : null
    return new nodes.FunctionDeclaration(
      name,
      params,
      returnType,
      functionBody(),
    )
  }

  function functionExpression(): nodes.FunctionExpression {
    consume('Expect "(" after fun', LEFT_PAREN)
    let params = functionParams()
    let returnType = match(COLON) ? typeAnnotation() : null
    return new nodes.FunctionExpression(params, returnType, functionBody())
  }

  function functionParams(): nodes.Param[] {
    let params: nodes.Param[] = []
    if (!check(RIGHT_PAREN)) {
      params.push(functionParam())
      while (match(COMMA)) {
        if (check(RIGHT_PAREN)) break // support trailing commas
        params.push(functionParam())
      }
    }
    consume('Expect ")" after function params', RIGHT_PAREN)
    return params
  }

  function functionParam(): nodes.Param {
    let name = consume('Expect parameter name', IDENTIFIER).lexeme
    let type = match(COLON) ? typeAnnotation() : null
    let initializer = match(EQUAL) ? expression() : null
    return new nodes.Param(name, type, initializer)
  }

  function functionBody(): Expr | nodes.Block {
    if (match(ARROW)) return expression()
    if (match(LEFT_BRACE)) return block()
    throw error(peek(), 'Expect "=>" or "{" before function body')
  }

  function varDeclaration(): nodes.VarDeclaration {
    let result = varWithType()
    let initializer = match(EQUAL) ? expression() : null
    terminator()
    return new nodes.VarDeclaration(result.name, result.type, initializer)
  }

  function varWithType(): nodes.VarDeclaration {
    let name = consume('Expect variable name', IDENTIFIER).lexeme
    let type = match(COLON) ? typeAnnotation() : null
    return new nodes.VarDeclaration(name, type, null)
  }

  function statement(): Stmt {
    if (match(FOREACH)) return foreachStatement()
    if (match(FOR)) return forStatement()
    if (match(IF)) return ifStatement()
    if (match(WHILE)) return whileStatement()
    if (match(ECHO)) return echoStatement()
    if (match(RETURN)) return new nodes.Return(expression())
    if (match(LEFT_BRACE)) return block()
    return expressionStatement()
  }

  function foreachStatement(): nodes.Foreach {
    consume('Expect "(" after "foreach"', LEFT_PAREN)
    let iterable = expression()
    consume('Expect "as" after foreach iterable expression', AS)
    let value = foreachVariable()
    let key: null | nodes.ForeachVariable = null
    if (match(ARROW)) {
      key = value
      value = foreachVariable()
    }
    consume('Expect ")" after foreach expression', RIGHT_PAREN)
    let body = statement()
    return new nodes.Foreach(key, value, iterable, body)
  }

  function foreachVariable(): nodes.ForeachVariable {
    let name = consume('Expect variable name', IDENTIFIER).lexeme
    let type = match(COLON) ? typeAnnotation() : null
    return new nodes.ForeachVariable(name, type)
  }

  function forStatement(): nodes.For {
    consume('Expect "(" after "for"', LEFT_PAREN)
    let initializer = forInitializer()
    let condition = forCondition()
    let increment = forIncrement()
    consume('Expect ")" after for clauses', RIGHT_PAREN)
    let body = statement()
    return new nodes.For(initializer, condition, increment, body)
  }

  function forInitializer(): Node | null {
    if (match(SEMICOLON)) return null
    if (match(VAR)) return varDeclaration()
    return expressionStatement()
  }

  function forCondition(): Expr | null {
    if (match(SEMICOLON)) return null
    let result = expression()
    consume('Expect ";" after loop condition', SEMICOLON)
    return result
  }

  function forIncrement(): Expr | null {
    if (check(RIGHT_PAREN)) return null
    return expression()
  }

  function ifStatement(): nodes.If {
    consume('Expect "(" after "if"', LEFT_PAREN)
    let condition = expression()
    consume('Expect ")" after if condition', RIGHT_PAREN)
    let thenBranch = statement()
    let elseBranch = match(ELSE) ? statement() : null
    return new nodes.If(condition, thenBranch, elseBranch)
  }

  function echoStatement(): nodes.Echo {
    let result = expression()
    terminator()
    return new nodes.Echo(result)
  }

  function whileStatement(): nodes.While {
    consume('Expect "(" after "while"', LEFT_PAREN)
    let condition = expression()
    consume('Expect ")" after while condition', RIGHT_PAREN)
    let body = statement()
    return new nodes.While(condition, body)
  }

  function block(): nodes.Block {
    const statements: Node[] = []
    while (!check(RIGHT_BRACE) && !isAtEnd()) {
      const next = declaration()
      if (next) statements.push(next)
    }
    consume('Expect "}" after block', RIGHT_BRACE)
    return new nodes.Block(statements)
  }

  function expressionStatement(): nodes.ExpressionStatement {
    let result = expression()
    terminator()
    return new nodes.ExpressionStatement(result)
  }

  function expression(): Expr {
    // TODO are these in the right places? think they need to be AFTER assign
    if (match(FUN)) return functionExpression()
    if (match(THROW)) return throwExpression()
    return assignment()
  }

  function throwExpression(): Expr {
    return new nodes.ThrowExpression(expression())
  }

  function assignment(): Expr {
    let result = ternary()
    if (
      match(
        EQUAL,
        PLUS_EQUAL,
        MINUS_EQUAL,
        STAR_EQUAL,
        STAR_STAR_EQUAL,
        SLASH_EQUAL,
        PERCENT_EQUAL,
        NULL_COALESCE_EQUAL,
        LOGICAL_OR_EQUAL,
        PLUS_DOT_EQUAL,
      )
    ) {
      let operator = previous()
      let value = assignment()
      if (result instanceof nodes.Identifier) {
        return new nodes.Assign(result, operator.lexeme, value)
      }
      throw error(operator, 'Invalid assignment target')
    }
    return result
  }

  function ternary(): Expr {
    let result = nullCoalesce()
    while (match(QUESTION)) {
      let left = nullCoalesce()
      consume('Expect ":" after ternary condition', COLON)
      let right = nullCoalesce()
      result = new nodes.Ternary(result, left, right)
    }
    return result
  }

  function nullCoalesce(): Expr {
    let result = logicalOr()
    while (match(NULL_COALESCE)) {
      let right = nullCoalesce()
      result = new nodes.Binary(result, '??', right)
    }
    return result
  }

  function logicalOr(): Expr {
    let result = logicalAnd()
    while (match(LOGICAL_OR)) {
      let operator = previous()
      let right = logicalAnd()
      result = new nodes.Binary(result, operator.lexeme, right)
    }
    return result
  }

  function logicalAnd(): Expr {
    let result = equality()
    while (match(LOGICAL_AND)) {
      let operator = previous()
      let right = equality()
      result = new nodes.Binary(result, operator.lexeme, right)
    }
    return result
  }

  function equality(): Expr {
    let result = comparison()
    while (
      match(
        BANG_EQUAL,
        EQUAL_EQUAL,
        BANG_EQUAL_EQUAL,
        EQUAL_EQUAL_EQUAL,
        SPACESHIP,
      )
    ) {
      let operator = previous()
      let right = comparison()
      result = new nodes.Binary(result, operator.lexeme, right)
    }
    return result
  }

  function comparison(): Expr {
    let result = stringConcat()
    while (match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL)) {
      let operator = previous()
      let right = stringConcat()
      result = new nodes.Binary(result, operator.lexeme, right)
    }
    return result
  }

  function stringConcat(): Expr {
    let result = term()
    while (match(PLUS_DOT)) {
      let operator = previous()
      let right = term()
      result = new nodes.Binary(result, operator.lexeme, right)
    }
    return result
  }

  function term(): Expr {
    let result = factor()
    while (match(MINUS, PLUS)) {
      let operator = previous()
      let right = factor()
      result = new nodes.Binary(result, operator.lexeme, right)
    }
    return result
  }

  function factor(): Expr {
    let result = instanceOf()
    while (match(SLASH, STAR, PERCENT)) {
      let operator = previous()
      let right = instanceOf()
      result = new nodes.Binary(result, operator.lexeme, right)
    }
    return result
  }

  function instanceOf(): Expr {
    let result = exponentiation()
    while (match(INSTANCEOF)) {
      let operator = previous()
      let right = exponentiation()
      result = new nodes.Binary(result, operator.lexeme, right)
    }
    return result
  }

  function exponentiation(): Expr {
    let result = unary()
    while (match(STAR_STAR)) {
      let operator = previous()
      let right = exponentiation()
      result = new nodes.Binary(result, operator.lexeme, right)
    }
    return result
  }

  function unary(): Expr {
    if (match(BANG, MINUS, PLUS, MINUS_MINUS, PLUS_PLUS)) {
      let operator = previous()
      let right = unary()
      return new nodes.Unary(operator.lexeme, right)
    }
    return matchExpression()
  }

  function matchExpression(): Expr {
    if (!match(MATCH)) return postfix()
    consume('Expect "(" after "match"', LEFT_PAREN)
    let subject = expression()
    consume('Expect ")" after match subject', RIGHT_PAREN)
    consume('Expect "{" before match body', LEFT_BRACE)
    let arms = matchArms()
    let defaultArm = matchDefaultArm()
    consume('Expect "}" after match body', RIGHT_BRACE)
    return new nodes.Match(subject, arms, defaultArm)
  }

  function matchArms(): nodes.MatchArm[] {
    let arms: nodes.MatchArm[] = []
    while (!check(RIGHT_BRACE) && !check(DEFAULT) && !isAtEnd()) {
      arms.push(matchArm())
    }
    return arms
  }

  function matchArm(): nodes.MatchArm {
    let patterns = [expression()]
    while (match(COMMA)) {
      if (check(ARROW)) break // support trailing commas
      patterns.push(expression())
    }
    consume('Expect "=>" after match patterns', ARROW)
    let body = expression()
    match(COMMA) // optional trailing comma
    return new nodes.MatchArm(patterns, body)
  }

  function matchDefaultArm(): Expr | null {
    if (!match(DEFAULT)) return null
    consume('Expect "=>" after "default"', ARROW)
    let result = expression()
    match(COMMA) // optional trailing comma
    return result
  }

  function postfix(): Expr {
    let result = newClone()
    if (match(PLUS_PLUS, MINUS_MINUS)) {
      let operator = previous()
      if (!(result instanceof nodes.Identifier))
        throw error(previous(), 'Invalid postfix target')
      result = new nodes.Postfix(result, operator.lexeme)
    }
    return result
  }

  function newClone(): Expr {
    if (match(NEW)) return new nodes.New(call())
    if (match(CLONE)) return new nodes.Clone(call())
    return call()
  }

  function call(): Expr {
    let ex = primary()
    while (true) {
      if (match(LEFT_PAREN)) {
        ex = new nodes.Call(ex, callArgs())
      } else if (match(DOT)) {
        ex = getExpression(ex)
      } else if (match(OPTIONAL_CHAIN)) {
        ex = optionalGetExpression(ex)
      } else if (match(COLON_COLON)) {
        ex = scopeResolution(ex)
      } else break
    }
    return ex
  }

  function callArgs(): Expr[] {
    let args: Expr[] = []
    if (match(RIGHT_PAREN)) return args
    args.push(expression())
    while (match(COMMA)) {
      if (check(RIGHT_PAREN)) break // support trailing commas
      args.push(expression())
    }
    consume('Expect ")" after arguments', RIGHT_PAREN)
    return args
  }

  function getExpression(receiver: Expr): nodes.Get {
    let name = consume('Expect property name after .', IDENTIFIER).lexeme
    return new nodes.Get(receiver, name)
  }

  function optionalGetExpression(receiver: Expr): nodes.OptionalGet {
    let name = consume('Expect property name after ?.', IDENTIFIER).lexeme
    return new nodes.OptionalGet(receiver, name)
  }

  function scopeResolution(receiver: Expr): nodes.ScopeResolution {
    let name = consume('Expect property name after ::', IDENTIFIER).lexeme
    return new nodes.ScopeResolution(receiver, name)
  }

  function primary(): Expr {
    if (match(NULL)) return new nodes.NullLiteral()
    if (match(NUMBER)) return numberLiteral()
    if (match(STRING)) return stringLiteral()
    if (match(TRUE)) return new nodes.BooleanLiteral(true)
    if (match(FALSE)) return new nodes.BooleanLiteral(false)
    if (match(LEFT_PAREN)) return grouping()
    if (match(LEFT_BRACKET)) return arrayLiteral()
    if (match(THIS)) return new nodes.This()
    if (match(SUPER)) return new nodes.Super()
    if (match(IDENTIFIER)) return identifier()
    throw error(peek(), 'Expect expression')
  }

  function numberLiteral() {
    return new nodes.NumberLiteral(previous().literal)
  }

  function stringLiteral() {
    return new nodes.StringLiteral(previous().literal)
  }

  function grouping(): Expr {
    let result = expression()
    consume('Expect ")" after expression', RIGHT_PAREN)
    return new nodes.Grouping(result)
  }

  function arrayLiteral(): nodes.ArrayLiteral {
    let elements = arrayElements()
    consume('Expect "]" after array literal', RIGHT_BRACKET)
    return new nodes.ArrayLiteral(elements)
  }

  function arrayElements(): nodes.ArrayElement[] {
    let elements: nodes.ArrayElement[] = []
    while (!check(RIGHT_BRACKET) && !isAtEnd()) {
      elements.push(arrayElement())
      match(COMMA)
    }
    return elements
  }

  function arrayElement(): nodes.ArrayElement {
    return new nodes.ArrayElement(arrayKey(), expression())
  }

  function identifier(): nodes.Identifier {
    return new nodes.Identifier(previous().lexeme)
  }

  function arrayKey(): nodes.NumberLiteral | nodes.StringLiteral | null {
    if (check(NUMBER, STRING) && checkNext(ARROW)) {
      try {
        if (match(NUMBER)) return numberLiteral()
        if (match(STRING)) return stringLiteral()
      } finally {
        match(ARROW)
      }
    }
    return null
  }

  function typeAnnotation(): Type {
    if (match(QUESTION)) return typeNullable()
    let first = type()
    if (check(PIPE)) return typeUnion(first)
    if (check(AMPERSAND)) return typeIntersection(first)
    return first
  }

  function typeUnion(first: Type): Type {
    let elements = [first]
    while (match(PIPE)) {
      elements.push(type())
    }
    return new types.Union(elements)
  }

  function typeIntersection(first: Type): Type {
    let elements = [first]
    while (match(AMPERSAND)) {
      elements.push(type())
    }
    if (elements.length === 1) return elements[0]
    return new types.Intersection(elements)
  }

  function typeNullable(): Type {
    return new types.Nullable(type())
  }

  function type(): Type {
    if (match(NULL)) return new types.Null()
    if (match(NUMBER)) return new types.NumberLiteral(previous().literal)
    if (match(STRING)) return new types.StringLiteral(previous().literal)
    if (match(TRUE)) return new types.True()
    if (match(FALSE)) return new types.False()
    if (match(IDENTIFIER)) return typeIdentifier()
    throw error(peek(), 'Expect type annotation')
  }

  function typeIdentifier(): Type {
    let lexeme = previous().lexeme
    if (lexeme === 'number') return new types.Number()
    if (lexeme === 'string') return new types.String()
    if (lexeme === 'bool') return new types.Boolean()
    if (lexeme === 'int') return new types.Int()
    if (lexeme === 'float') return new types.Float()
    return new types.Identifier(lexeme, typeGenerics())
  }

  function typeGenerics(): Type[] {
    let generics: Type[] = []
    if (match(LESS)) {
      generics.push(typeGeneric())
      while (match(COMMA)) {
        if (check(GREATER)) break // support trailing commas
        generics.push(typeGeneric())
      }
      consume('Expect ">" after type generics', GREATER)
    }
    return generics
  }

  function typeGeneric(): Type {
    return typeAnnotation()
  }

  function match(...types: TokenType[]): boolean {
    for (let type of types) {
      if (check(type)) {
        advance()
        return true
      }
    }
    return false
  }

  function matchIdentifier(name: string): boolean {
    if (peek().type === IDENTIFIER && peek().lexeme === name) {
      advance()
      return true
    }
    return false
  }

  function consume(message: string, ...anyOf: TokenType[]): Token {
    for (let type of anyOf) {
      if (check(type)) {
        return advance()
      }
    }
    throw error(peek(), message)
  }

  function terminator() {
    consume('Expect terminator', SEMICOLON, EOF)
  }

  function error(token: Token, message: string): Error {
    return new ParseError(`[line ${token.line}] Error${token}: ${message}`)
  }

  function check(...anyOf: TokenType[]): boolean {
    if (isAtEnd()) return anyOf.includes(EOF)
    return anyOf.includes(peek().type)
  }

  function checkNext(...anyOf: TokenType[]): boolean {
    if (isAtEnd()) return anyOf.includes(EOF)
    return anyOf.includes(peekNext().type)
  }

  function advance(): Token {
    let result = peek()
    if (!isAtEnd()) current++
    return result
  }

  function isAtEnd(): boolean {
    return peek().type === EOF
  }

  function peek(): Token {
    return tokens[current]
  }

  function peekNext(): Token {
    if (isAtEnd()) return peek()
    return tokens[current + 1]
  }

  function previous(): Token {
    return tokens[current - 1]
  }
}
