import { Token, TokenType } from './Token';

const {
  AMPERSAND,
  BANG_EQUAL_EQUAL,
  BANG_EQUAL,
  BANG,
  CLASS,
  COLON_COLON,
  COLON,
  COMMA,
  DOT,
  ECHO,
  ELSE,
  ELVIS,
  EOF,
  EOL,
  EQUAL_EQUAL_EQUAL,
  EQUAL_EQUAL,
  EQUAL,
  FALSE,
  FOR,
  FUN,
  GREATER_EQUAL,
  GREATER,
  IDENTIFIER,
  IF,
  LEFT_BRACE,
  LEFT_PAREN,
  LESS_EQUAL,
  LESS,
  LOGICAL_AND,
  LOGICAL_OR,
  MATCH,
  MINUS_MINUS,
  MINUS,
  NULL_COALESCE,
  NULL,
  NUMBER,
  PIPE,
  PLUS_PLUS,
  PLUS,
  QUESTION,
  RETURN,
  RIGHT_BRACE,
  RIGHT_PAREN,
  SEMICOLON,
  SLASH,
  SPACESHIP,
  STAR,
  STRING,
  SUPER,
  THIS,
  TRUE,
  VAL,
  VAR,
  WHILE,
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
