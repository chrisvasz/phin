import { Token, TokenType } from './Token';

const {
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACE,
  RIGHT_BRACE,
  COMMA,
  DOT,
  COLON,
  COLON_COLON,
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

const keywords = new Map<string, TokenType>([
  ['class', CLASS],
  ['echo', ECHO],
  ['else', ELSE],
  ['false', FALSE],
  ['fun', FUN],
  ['for', FOR],
  ['if', IF],
  ['match', MATCH],
  ['null', NULL],
  ['return', RETURN],
  ['super', SUPER],
  ['this', THIS],
  ['true', TRUE],
  ['val', VAL],
  ['var', VAR],
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
  chars[code(',')] = () => addToken(COMMA);
  chars[code('.')] = () => addToken(DOT);
  chars[code('-')] = () => addToken(MINUS);
  chars[code('+')] = () => addToken(PLUS);
  chars[code(';')] = () => addToken(SEMICOLON);
  chars[code('*')] = () => addToken(STAR);
  chars[code('!')] = () => addToken(match('=') ? BANG_EQUAL : BANG);
  chars[code('=')] = () => addToken(match('=') ? EQUAL_EQUAL : EQUAL);
  chars[code('<')] = () => addToken(match('=') ? LESS_EQUAL : LESS);
  chars[code('>')] = () => addToken(match('=') ? GREATER_EQUAL : GREATER);
  chars[code(':')] = () => addToken(match(':') ? COLON_COLON : COLON);
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
    console.log('Unexpected character on line ' + line);
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

  function peek() {
    if (isAtEnd()) return '\0';
    return source.charAt(current);
  }

  function string() {
    while (peek() !== '"' && peek() !== '\n' && !isAtEnd()) {
      advance();
    }
    if (peek() !== '"') {
      console.error('Unterminated string on line ' + line);
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
    while (isDigit(peek())) advance();
    if (peek() === '.' && isDigit(peekNext())) {
      advance(); // consume the "."
      while (isDigit(peek())) advance();
    }
    addToken(NUMBER, parseFloat(source.substring(start, current)));
  }

  function identifier() {
    while (isAlphaNumeric(peek())) advance();
    const text = source.substring(start, current);
    const type = keywords.get(text) || IDENTIFIER;
    addToken(type);
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

  function isAlpha(c: string) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
  }

  function isAlphaNumeric(c: string) {
    return isAlpha(c) || isDigit(c);
  }
}
