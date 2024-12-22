import {
  Assign,
  Binary,
  Block,
  BooleanLiteral,
  EchoStatement,
  Expr,
  ExpressionStatement,
  Grouping,
  NullLiteral,
  NumberLiteral,
  StringLiteral,
  Unary,
  Variable,
  VarStatement,
  Visitor,
} from './nodes';

export class PhpPrinter implements Visitor<string> {
  print(expr: Expr): string {
    return expr.accept(this);
  }

  visitBlock(stmt: Block): string {
    return ['{', ...stmt.statements.map(s => s.accept(this)), '}'].join('\n');
  }

  visitVarStatement(stmt: VarStatement): string {
    let result = `$${stmt.name.lexeme}`;
    if (stmt.initializer) {
      result += ` = ${stmt.initializer.accept(this)}`;
    }
    return result + ';';
  }

  visitEchoStatement(stmt: EchoStatement): string {
    return `echo ${stmt.expression.accept(this)};`;
  }

  visitExpressionStatement(stmt: ExpressionStatement): string {
    return `${stmt.expression.accept(this)};`;
  }

  visitAssign(expr: Assign): string {
    return `$${expr.name.lexeme} = ${expr.value.accept(this)}`;
  }

  visitNumberLiteral(expr: NumberLiteral): string {
    return expr.value.toString();
  }

  visitStringLiteral(expr: StringLiteral): string {
    // TODO escape " characters
    return `"${expr.value}"`;
  }

  visitBooleanLiteral(expr: BooleanLiteral): string {
    return expr.value ? 'true' : 'false';
  }

  visitNullLiteral(expr: NullLiteral): string {
    return 'null';
  }

  visitBinary(expr: Binary): string {
    const left = expr.left.accept(this);
    const right = expr.right.accept(this);
    return `${left} ${expr.operator.lexeme} ${right}`;
  }

  visitGrouping(expr: Grouping): string {
    return `(${expr.expression.accept(this)})`;
  }

  visitUnary(expr: Unary): string {
    return `${expr.operator.lexeme}${expr.right.accept(this)}`;
  }

  visitVariable(expr: Variable): string {
    return `$${expr.name.lexeme}`;
  }
}
