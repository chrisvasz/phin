import {
  Assign,
  Binary,
  Block,
  BooleanLiteral,
  EchoStatement,
  Expr,
  ExpressionStatement,
  Grouping,
  If,
  NullLiteral,
  NumberLiteral,
  Stmt,
  StringLiteral,
  Unary,
  Variable,
  VarStatement,
  Visitor,
} from './nodes';

export class AstPrinter implements Visitor<string> {
  currentIndent = 0;

  indent(str: string): string {
    return '  '.repeat(this.currentIndent) + str;
  }

  wrapIndent(fn: () => string | string[]): string {
    try {
      this.currentIndent++;
      let result = fn();
      if (Array.isArray(result)) {
        return result.join('\n');
      }
      return result;
    } finally {
      this.currentIndent--;
    }
  }

  printStatements(statements: Stmt[]): string {
    return statements.map(s => s.accept(this)).join('\n');
  }

  printExpression(expr: Expr): string {
    return expr.accept(this);
  }

  visitBlock(stmt: Block): string {
    return '';
  }

  visitIf({ condition, thenBranch, elseBranch }: If): string {
    return '';
  }

  visitVarStatement(stmt: VarStatement): string {
    return '';
  }

  visitEchoStatement(stmt: EchoStatement): string {
    return '';
  }

  visitExpressionStatement(stmt: ExpressionStatement): string {
    let result: string[] = [];
    result.push(this.indent('ExpressionStatement'));
    result.push(this.wrapIndent(() => stmt.expression.accept(this)));
    return result.join('\n');
  }

  visitAssign(expr: Assign): string {
    return '';
  }

  visitNumberLiteral(expr: NumberLiteral): string {
    return this.indent(`NumberLiteral ${expr.value}`);
  }

  visitStringLiteral(expr: StringLiteral): string {
    return this.indent(`StringLiteral "${expr.value}"`);
  }

  visitBooleanLiteral(expr: BooleanLiteral): string {
    return this.indent(`BooleanLiteral ${expr.value}`);
  }

  visitNullLiteral(expr: NullLiteral): string {
    return this.indent(`NullLiteral`);
  }

  visitBinary(expr: Binary): string {
    return [
      this.indent(`Binary ${expr.operator.lexeme}`),
      this.wrapIndent(() => expr.left.accept(this)),
      this.wrapIndent(() => expr.right.accept(this)),
    ].join('\n');
  }

  visitGrouping(expr: Grouping): string {
    return '';
  }

  visitUnary(expr: Unary): string {
    return '';
  }

  visitVariable(expr: Variable): string {
    return '';
  }
}
