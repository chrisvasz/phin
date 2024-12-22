import {
  Binary,
  BooleanLiteral,
  EchoStatement,
  Expr,
  ExpressionStatement,
  Grouping,
  NullLiteral,
  NumberLiteral,
  StringLiteral,
  Unary,
  Visitor,
} from './nodes';

export class PhpPrinter implements Visitor<string> {
  print(expr: Expr): string {
    return expr.accept(this);
  }

  visitEchoStatement(stmt: EchoStatement): string {
    return `echo ${stmt.expression.accept(this)};`;
  }

  visitExpressionStatement(stmt: ExpressionStatement): string {
    return stmt.expression.accept(this);
  }

  visitNumberLiteral(expr: NumberLiteral): string {
    return expr.value.toString();
  }

  visitStringLiteral(expr: StringLiteral): string {
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
}
