import { Token, TokenType } from '../token'

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

// TODO from php.net: The following words cannot be used as constants, class names, or function names. They are, however, allowed as property, constant, and method names of classes, interfaces and traits, except that class may not be used as constant name.

const keywords: { [key: string]: TokenType } = {
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
  for: FOR,
  foreach: FOREACH,
  fun: FUN,
  if: IF,
  instanceof: INSTANCEOF,
  implements: IMPLEMENTS,
  match: MATCH,
  new: NEW,
  null: NULL,
  private: PRIVATE,
  protected: PROTECTED,
  public: PUBLIC,
  readonly: READONLY,
  return: RETURN,
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

export default function scan(source: string): Token[] {
  const tokens: Token[] = []
  let start = 0
  let current = 0
  let line = 1
  let hasError = false

  const chars = new Array(256).fill(null)
  const code = (char: string) => char.charCodeAt(0)
  chars[code('(')] = () => addToken(LEFT_PAREN)
  chars[code(')')] = () => addToken(RIGHT_PAREN)
  chars[code('{')] = () => addToken(LEFT_BRACE)
  chars[code('}')] = () => addToken(RIGHT_BRACE)
  chars[code('[')] = () => addToken(LEFT_BRACKET)
  chars[code(']')] = () => addToken(RIGHT_BRACKET)
  chars[code(',')] = () => addToken(COMMA)
  chars[code('.')] = () => addToken(DOT)
  chars[code('+')] = plus
  chars[code('-')] = minus
  chars[code(';')] = () => addToken(SEMICOLON)
  chars[code('*')] = star
  chars[code('!')] = bang
  chars[code('=')] = equal
  chars[code('<')] = less
  chars[code('>')] = () => addToken(match('=') ? GREATER_EQUAL : GREATER)
  chars[code(':')] = () => addToken(match(':') ? COLON_COLON : COLON)
  chars[code('?')] = question
  chars[code('|')] = pipe
  chars[code('&')] = () => addToken(match('&') ? LOGICAL_AND : AMPERSAND)
  chars[code('%')] = percent
  chars[code('"')] = doubleQuoteString
  chars[code('/')] = slash
  chars[code(' ')] = () => {}
  chars[code('\r')] = () => {}
  chars[code('\t')] = () => {}
  chars[code('\n')] = eol

  return scanTokens()

  function scanTokens() {
    while (!isAtEnd()) {
      scanToken()
    }
    tokens.push(new Token(EOF, '', null, line))
    if (hasError) throw new Error('Scanner error')
    return tokens
  }

  function scanToken() {
    start = current
    let c = advance()
    if (chars[code(c)]) return chars[code(c)]()
    if (isDigit(c)) return number()
    if (isAlpha(c)) return identifier()
    console.error('Scanner error: unexpected character on line ' + line)
    hasError = true
  }

  function advance() {
    return source.charAt(current++)
  }

  function addToken(
    type: TokenType,
    literal?: any,
    text: string = source.substring(start, current),
  ) {
    tokens.push(new Token(type, text, literal, line))
  }

  function match(expected: string) {
    if (isAtEnd()) return false
    if (source.charAt(current) !== expected) return false
    current++
    return true
  }

  function plus() {
    if (match('=')) addToken(PLUS_EQUAL)
    else if (match('+')) addToken(PLUS_PLUS)
    else if (match('.')) {
      if (match('=')) addToken(PLUS_DOT_EQUAL)
      else addToken(PLUS_DOT)
    } else addToken(PLUS)
  }

  function minus() {
    if (match('=')) addToken(MINUS_EQUAL)
    else if (match('-')) addToken(MINUS_MINUS)
    else addToken(MINUS)
  }

  function star() {
    if (match('*')) {
      if (match('=')) addToken(STAR_STAR_EQUAL)
      else addToken(STAR_STAR)
    } else if (match('=')) addToken(STAR_EQUAL)
    else addToken(STAR)
  }

  function slash() {
    if (match('/')) {
      while (peek() != '\n' && !isAtEnd()) advance() // till end of line
    } else if (match('=')) addToken(SLASH_EQUAL)
    else addToken(SLASH)
  }

  function percent() {
    if (match('=')) addToken(PERCENT_EQUAL)
    else addToken(PERCENT)
  }

  function bang() {
    if (match('=')) {
      if (match('=')) addToken(BANG_EQUAL_EQUAL)
      else addToken(BANG_EQUAL)
    } else addToken(BANG)
  }

  function equal() {
    if (match('=')) {
      if (match('=')) addToken(EQUAL_EQUAL_EQUAL)
      else addToken(EQUAL_EQUAL)
    } else if (match('>')) addToken(ARROW)
    else addToken(EQUAL)
  }

  function less() {
    if (match('=')) {
      if (match('>')) {
        addToken(SPACESHIP)
      } else {
        addToken(LESS_EQUAL)
      }
    } else {
      addToken(LESS)
    }
  }

  function question() {
    if (match('?')) {
      if (match('=')) addToken(NULL_COALESCE_EQUAL)
      else addToken(NULL_COALESCE)
    } else if (match(':')) addToken(ELVIS)
    else if (match('.')) addToken(OPTIONAL_CHAIN)
    else addToken(QUESTION)
  }

  function pipe() {
    if (match('|')) {
      if (match('=')) addToken(LOGICAL_OR_EQUAL)
      else addToken(LOGICAL_OR)
    } else addToken(PIPE)
  }

  function doubleQuoteString() {
    let result = doubleQuoteStringParts()
    if (prevTokens(DOUBLE_QUOTE, DOUBLE_QUOTE)) {
      tokens.pop()
      tokens.pop()
      tokens.push(new Token(STRING, '', '', line))
    } else if (prevTokens(DOUBLE_QUOTE, STRING_PART, DOUBLE_QUOTE)) {
      tokens.pop()
      let string = tokens.pop()!
      tokens.pop()
      tokens.push(new Token(STRING, string.lexeme, string.literal, line))
    }
    return result
  }

  function doubleQuoteStringParts() {
    addToken(DOUBLE_QUOTE)
    start = current
    while (!isAtEnd()) {
      doubleQuoteStringPart()
      if (peek() === '"') break
      if (peek() === '$') {
        if (peekNext() === '{') {
          doubleQuoteStringExpression()
        } else if (isAlpha(peekNext())) {
          doubleQuoteStringIdentifier()
        }
      }
      start = current
    }
    if (peek() !== '"') {
      console.error('Unterminated string on line ' + line)
      hasError = true
      return
    }
    advance() // consume the closing "
    addToken(DOUBLE_QUOTE)
  }

  function doubleQuoteStringPart() {
    while (!isAtEnd()) {
      if (peek() === '\n') line++
      if (peek() === '"') break
      if (peek() === '$') {
        if (peekNext() === '{') break
        if (isAlpha(peekNext())) break
      }
      advance()
    }
    if (start !== current) {
      addToken(STRING_PART, source.substring(start, current))
      start = current
    }
  }

  function doubleQuoteStringIdentifier() {
    advance() // consume the $
    start = current
    identifier()
  }

  function doubleQuoteStringExpression() {
    advance() // consume the $
    start = current
    while (!isAtEnd()) {
      scanToken()
      if (prevTokens(RIGHT_BRACE)) break
    }
    if (previous() !== '}') {
      console.error('Unterminated template expression on line ' + line)
      hasError = true
    }
  }

  function eol() {
    line++
  }

  function number() {
    if (previous() === '0') {
      if ((peek() === 'x' || peek() === 'X') && isHexDigit(peekNext())) {
        advance() // consume the x
        advance() // consume the first digit
        return hexNumber()
      }
      if ((peek() === 'o' || peek() === 'O') && isOctalDigit(peekNext())) {
        advance() // consume the o
        advance() // consume the first digit
        return octalNumber()
      }
      if ((peek() === 'b' || peek() === 'B') && isBinaryDigit(peekNext())) {
        advance() // consume the b
        advance() // consume the first digit
        return binaryNumber()
      }
    }
    return decimalNumber()
  }

  function decimalNumber() {
    while (isDigitOr_(peek())) advance()
    let type = INT
    if (peek() === '.' && isDigit(peekNext())) {
      advance() // consume the .
      advance() // consume the digit after .
      while (isDigitOr_(peek())) advance()
      type = FLOAT
    }
    addToken(type, source.substring(start, current).replaceAll('_', ''))
  }

  function hexNumber() {
    while (isHexDigitOr_(peek())) advance()
    addToken(INT, source.substring(start, current).replaceAll('_', ''))
  }

  function octalNumber() {
    while (isOctalDigitOr_(peek())) advance()
    addToken(INT, source.substring(start, current).replaceAll('_', ''))
  }

  function binaryNumber() {
    while (isBinaryDigitOr_(peek())) advance()
    addToken(INT, source.substring(start, current).replaceAll('_', ''))
  }

  function identifier() {
    while (isAlphaNumeric(peek())) advance()
    const text = source.substring(start, current)
    const type = keywords[text] ?? IDENTIFIER
    addToken(type)
  }

  function prevTokens(...checks: TokenType[]) {
    for (let i = 0; i < checks.length; ++i) {
      let check = checks[i]
      let token = tokens[tokens.length - i - 1] ?? EOF
      if (check !== token.type) return false
    }
    return true
  }

  function previous() {
    if (current === 0) return '\0'
    return source.charAt(current - 1)
  }

  function peek() {
    if (isAtEnd()) return '\0'
    return source.charAt(current)
  }

  function peekNext() {
    if (current + 1 >= source.length) return '\0'
    return source.charAt(current + 1)
  }

  function isAtEnd() {
    return current >= source.length
  }

  function isDigit(c: string) {
    return c >= '0' && c <= '9'
  }

  function isDigitOr_(c: string) {
    return isDigit(c) || c === '_'
  }

  function isHexDigit(c: string) {
    return isDigit(c) || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F')
  }

  function isHexDigitOr_(c: string) {
    return isHexDigit(c) || c === '_'
  }

  function isOctalDigit(c: string) {
    return c >= '0' && c <= '7'
  }

  function isOctalDigitOr_(c: string) {
    return isOctalDigit(c) || c === '_'
  }

  function isBinaryDigit(c: string) {
    return c === '0' || c === '1'
  }

  function isBinaryDigitOr_(c: string) {
    return isBinaryDigit(c) || c === '_'
  }

  function isAlpha(c: string) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'
  }

  function isAlphaNumeric(c: string) {
    return isAlpha(c) || isDigit(c)
  }
}

function printTokens(tokens: Token[]) {
  for (let token of tokens) {
    console.log(token.toString())
  }
}
