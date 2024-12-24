import { Token, TokenType } from './Token';

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
  COLON_COLON,
  COLON,
  COMMA,
  CONST,
  DEFAULT,
  DOT,
  ECHO,
  ELSE,
  ELVIS,
  EOF,
  EOL,
  EQUAL_EQUAL_EQUAL,
  EQUAL_EQUAL,
  EQUAL,
  EXTENDS,
  FALSE,
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
  NULL_COALESCE,
  NULL,
  NUMBER,
  PIPE,
  PLUS_PLUS,
  PLUS,
  PRIVATE,
  PROTECTED,
  PUBLIC,
  QUESTION,
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

const keywords = new Map<string, TokenType>([
  ['abstract', ABSTRACT],
  ['as', AS],
  ['catch', CATCH],
  ['class', CLASS],
  ['const', CONST],
  ['default', DEFAULT],
  ['echo', ECHO],
  ['else', ELSE],
  ['extends', EXTENDS],
  ['false', FALSE],
  ['finally', FINALLY],
  ['for', FOR],
  ['foreach', FOREACH],
  ['fun', FUN],
  ['if', IF],
  ['implements', IMPLEMENTS],
  ['match', MATCH],
  ['new', NEW],
  ['null', NULL],
  ['private', PRIVATE],
  ['protected', PROTECTED],
  ['public', PUBLIC],
  ['return', RETURN],
  ['super', SUPER],
  ['static', STATIC],
  ['this', THIS],
  ['throw', THROW],
  ['true', TRUE],
  ['try', TRY],
  ['val', VAL],
  ['var', VAR],
  ['while', WHILE],
]);

export default function scan(source: string): Token[] {
  const tokens: Token[] = [];
  let start = 0;
  let current = 0;
  let line = 1;
  let hasError = false;

  const chars = new Array(200).fill(null);
  const code = (char: string) => char.charCodeAt(0);
  chars[code('(')] = () => addToken(LEFT_PAREN);
  chars[code(')')] = () => addToken(RIGHT_PAREN);
  chars[code('{')] = () => addToken(LEFT_BRACE);
  chars[code('}')] = () => addToken(RIGHT_BRACE);
  chars[code('[')] = () => addToken(LEFT_BRACKET);
  chars[code(']')] = () => addToken(RIGHT_BRACKET);
  chars[code(',')] = () => addToken(COMMA);
  chars[code('.')] = () => addToken(DOT);
  chars[code('-')] = () => addToken(match('-') ? MINUS_MINUS : MINUS);
  chars[code('+')] = () => addToken(match('+') ? PLUS_PLUS : PLUS);
  chars[code(';')] = () => addToken(SEMICOLON);
  chars[code('*')] = () => addToken(STAR);
  chars[code('!')] = bang;
  chars[code('=')] = equal;
  chars[code('<')] = less;
  chars[code('>')] = () => addToken(match('=') ? GREATER_EQUAL : GREATER);
  chars[code(':')] = () => addToken(match(':') ? COLON_COLON : COLON);
  chars[code('?')] = question;
  chars[code('|')] = () => addToken(match('|') ? LOGICAL_OR : PIPE);
  chars[code('&')] = () => addToken(match('&') ? LOGICAL_AND : AMPERSAND);
  chars[code('"')] = string;
  chars[code('/')] = slash;
  chars[code(' ')] = () => {};
  chars[code('\r')] = () => {};
  chars[code('\t')] = () => {};
  chars[code('\n')] = eol;

  return scanTokens();

  function scanTokens() {
    while (!isAtEnd()) {
      start = current;
      scanToken();
    }
    tokens.push(new Token(EOF, '', null, line));
    if (hasError) throw new Error('Scanner error');
    return tokens;
  }

  function scanToken() {
    let c = advance();
    if (chars[code(c)]) {
      return chars[code(c)]();
    }
    if (isDigit(c)) return number();
    if (isAlpha(c)) return identifier();
    console.error('Unexpected character on line ' + line);
    hasError = true;
  }

  function advance() {
    return source.charAt(current++);
  }

  function addToken(type: TokenType, literal?: any) {
    const text = source.substring(start, current);
    tokens.push(new Token(type, text, literal, line));
  }

  function match(expected: string) {
    if (isAtEnd()) return false;
    if (source.charAt(current) !== expected) return false;
    current++;
    return true;
  }

  function bang() {
    if (match('=')) {
      if (match('=')) {
        addToken(BANG_EQUAL_EQUAL);
      } else {
        addToken(BANG_EQUAL);
      }
    } else {
      addToken(BANG);
    }
  }

  function equal() {
    if (match('=')) {
      if (match('=')) {
        addToken(EQUAL_EQUAL_EQUAL);
      } else {
        addToken(EQUAL_EQUAL);
      }
    } else if (match('>')) {
      addToken(ARROW);
    } else {
      addToken(EQUAL);
    }
  }

  function less() {
    if (match('=')) {
      if (match('>')) {
        addToken(SPACESHIP);
      } else {
        addToken(LESS_EQUAL);
      }
    } else {
      addToken(LESS);
    }
  }

  function question() {
    if (match('?')) {
      addToken(NULL_COALESCE);
    } else if (match(':')) {
      addToken(ELVIS);
    } else {
      addToken(QUESTION);
    }
  }

  function string() {
    while (peek() !== '"' && peek() !== '\n' && !isAtEnd()) {
      advance();
    }
    if (peek() !== '"') {
      console.error('Unterminated string on line ' + line);
      hasError = true;
      return;
    }
    advance(); // consume the closing "
    const value = source.substring(start + 1, current - 1);
    addToken(STRING, value);
  }

  function slash() {
    if (match('/')) {
      while (peek() != '\n' && !isAtEnd()) advance(); // till end of line
    } else {
      addToken(SLASH);
    }
  }

  function eol() {
    addToken(EOL);
    line++;
  }

  function number() {
    if (previous() === '0') {
      if ((peek() === 'x' || peek() === 'X') && isHexDigit(peekNext())) {
        advance(); // consume the x
        return hexNumber();
      }
      if ((peek() === 'o' || peek() === 'O') && isOctalDigit(peekNext())) {
        advance(); // consume the o
        return octalNumber();
      }
      if ((peek() === 'b' || peek() === 'B') && isBinaryDigit(peekNext())) {
        advance(); // consume the b
        return binaryNumber();
      }
    }

    while (isDigitOr_(peek())) advance();
    if (peek() === '.' && isDigit(peekNext())) {
      advance(); // consume the .
      advance(); // consume the digit after .
      while (isDigitOr_(peek())) advance();
    }
    addToken(NUMBER, source.substring(start, current).replaceAll('_', ''));
  }

  function hexNumber() {
    advance(); // consume the first digit
    while (isHexDigitOr_(peek())) advance();
    addToken(NUMBER, source.substring(start, current).replaceAll('_', ''));
  }

  function octalNumber() {
    advance(); // consume the first digit
    while (isOctalDigitOr_(peek())) advance();
    addToken(NUMBER, source.substring(start, current).replaceAll('_', ''));
  }

  function binaryNumber() {
    advance(); // consume the first digit
    while (isBinaryDigitOr_(peek())) advance();
    addToken(NUMBER, source.substring(start, current).replaceAll('_', ''));
  }

  function identifier() {
    while (isAlphaNumeric(peek())) advance();
    const text = source.substring(start, current);
    const type = keywords.get(text) || IDENTIFIER;
    addToken(type);
  }

  function previous() {
    if (current === 0) return '\0';
    return source.charAt(current - 1);
  }

  function peek() {
    if (isAtEnd()) return '\0';
    return source.charAt(current);
  }

  function peekNext() {
    if (current + 1 >= source.length) return '\0';
    return source.charAt(current + 1);
  }

  function isAtEnd() {
    return current >= source.length;
  }

  function isDigit(c: string) {
    return c >= '0' && c <= '9';
  }

  function isDigitOr_(c: string) {
    return isDigit(c) || c === '_';
  }

  function isHexDigit(c: string) {
    return isDigit(c) || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F');
  }

  function isHexDigitOr_(c: string) {
    return isHexDigit(c) || c === '_';
  }

  function isOctalDigit(c: string) {
    return c >= '0' && c <= '7';
  }

  function isOctalDigitOr_(c: string) {
    return isOctalDigit(c) || c === '_';
  }

  function isBinaryDigit(c: string) {
    return c === '0' || c === '1';
  }

  function isBinaryDigitOr_(c: string) {
    return isBinaryDigit(c) || c === '_';
  }

  function isAlpha(c: string) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
  }

  function isAlphaNumeric(c: string) {
    return isAlpha(c) || isDigit(c);
  }
}
