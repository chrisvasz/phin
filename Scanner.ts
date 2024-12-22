import { Token, TokenType } from './Token';

const keywords = new Map<string, TokenType>([
  ['class', TokenType.CLASS],
  ['else', TokenType.ELSE],
  ['false', TokenType.FALSE],
  ['fun', TokenType.FUN],
  ['for', TokenType.FOR],
  ['if', TokenType.IF],
  ['match', TokenType.MATCH],
  ['null', TokenType.NULL],
  ['return', TokenType.RETURN],
  ['super', TokenType.SUPER],
  ['this', TokenType.THIS],
  ['true', TokenType.TRUE],
  ['val', TokenType.VAL],
  ['var', TokenType.VAR],
]);

export default function scan(source: string) {
  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();
  return tokens;
}

export class Scanner {
  private tokens: Token[] = [];
  private start = 0;
  private current = 0;
  private line = 1;
  private hasError = false;

  constructor(private readonly source: string) {}

  scanTokens() {
    while (!this.isAtEnd()) {
      // We are at the beginning of the next lexeme.
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, '', null, this.line));
    if (this.hasError) {
      throw new Error('Scanner error');
    }
    return this.tokens;
  }

  private scanToken() {
    let c = this.advance();
    switch (c) {
      case '(':
        return this.addToken(TokenType.LEFT_PAREN);
      case ')':
        return this.addToken(TokenType.RIGHT_PAREN);
      case '{':
        return this.addToken(TokenType.LEFT_BRACE);
      case '}':
        return this.addToken(TokenType.RIGHT_BRACE);
      case ',':
        return this.addToken(TokenType.COMMA);
      case '.':
        return this.addToken(TokenType.DOT);
      case '-':
        return this.addToken(TokenType.MINUS);
      case '+':
        return this.addToken(TokenType.PLUS);
      case ';':
        return this.addToken(TokenType.SEMICOLON);
      case '*':
        return this.addToken(TokenType.STAR);
      case '!':
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=':
        this.addToken(
          this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
        );
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '>':
        this.addToken(
          this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER,
        );
        break;
      case '/':
        if (this.match('/')) {
          // A comment goes until the end of the line.
          while (this.peek() != '\n' && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break;
      case '\n':
        this.line++;
        break;
      case '"':
        this.string();
        break;
      default:
        if (this.isDigit(c)) {
          return this.number();
        } else if (this.isAlpha(c)) {
          return this.identifier();
        } else {
          console.log('Unexpected character on line ' + this.line);
          this.hasError = true;
        }
        break;
    }
  }

  private advance() {
    return this.source.charAt(this.current++);
  }

  private addToken(type: TokenType, literal?: any) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }

  private match(expected: string) {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;
    this.current++;
    return true;
  }

  private peek() {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  private string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;
      this.advance();
    }

    // Unterminated string.
    if (this.isAtEnd()) {
      console.log('Unterminated string on line ' + this.line);
      return;
    }

    // The closing ".
    this.advance();

    // Trim the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  private isDigit(c: string) {
    return c >= '0' && c <= '9';
  }

  private isAlpha(c: string) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
  }

  isAlphaNumeric(c: string) {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private number() {
    while (this.isDigit(this.peek())) this.advance();

    // Look for a fractional part.
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance();

      while (this.isDigit(this.peek())) this.advance();
    }

    this.addToken(
      TokenType.NUMBER,
      parseFloat(this.source.substring(this.start, this.current)),
    );
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    // See if the identifier is a reserved word.
    const text = this.source.substring(this.start, this.current);
    const type = keywords.get(text) || TokenType.IDENTIFIER;
    this.addToken(type);
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }
}
