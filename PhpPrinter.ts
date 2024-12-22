import {
  Binary,
  BooleanLiteral,
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

  visitExpressionStatementStmt(stmt: ExpressionStatement): string {
    return stmt.expression.accept(this);
  }

  visitNumberLiteralExpr(expr: NumberLiteral): string {
    return expr.value.toString();
  }

  visitStringLiteralExpr(expr: StringLiteral): string {
    return `"${expr.value}"`;
  }

  visitBooleanLiteralExpr(expr: BooleanLiteral): string {
    return expr.value ? 'true' : 'false';
  }

  visitNullLiteralExpr(expr: NullLiteral): string {
    return 'null';
  }

  visitBinaryExpr(expr: Binary): string {
    const left = expr.left.accept(this);
    const right = expr.right.accept(this);
    return `${left} ${expr.operator.lexeme} ${right}`;
  }

  visitGroupingExpr(expr: Grouping): string {
    return `(${expr.expression.accept(this)})`;
  }

  visitUnaryExpr(expr: Unary): string {
    return `${expr.operator.lexeme}${expr.right.accept(this)}`;
  }
}
