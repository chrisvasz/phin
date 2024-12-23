import * as stmt from './stmt';
import { Stmt } from './stmt';
import * as expr from './expr';
import { Expr } from './expr';

export class PhpPrinter implements expr.Visitor<string>, stmt.Visitor<string> {
  printStatements(statements: Stmt[]): string {
    return statements.map(s => s.accept(this)).join('\n');
  }

  printExpression(expr: Expr): string {
    return expr.accept(this);
  }

  visitBlockStmt(stmt: stmt.Block): string {
    return ['{', ...stmt.statements.map(s => s.accept(this)), '}'].join('\n');
  }

  visitIfStmt({ condition, thenBranch, elseBranch }: stmt.If): string {
    let result = `if (${condition.accept(this)}) ${thenBranch.accept(this)}`;
    if (elseBranch) {
      result += ` else ${elseBranch.accept(this)}`;
    }
    return result;
  }

  visitVarStmt(stmt: stmt.Var): string {
    let result = `$${stmt.name.lexeme}`;
    if (stmt.initializer) {
      result += ` = ${stmt.initializer.accept(this)}`;
    }
    return result + ';';
  }

  visitEchoStmt(stmt: stmt.Echo): string {
    return `echo ${stmt.expression.accept(this)};`;
  }

  visitExpressionStmt(stmt: stmt.Expression): string {
    return `${stmt.expression.accept(this)};`;
  }

  visitAssignExpr(expr: expr.Assign): string {
    return `$${expr.name} = ${expr.value.accept(this)}`;
  }

  visitNumberLiteralExpr(expr: expr.NumberLiteral): string {
    return expr.value.toString();
  }

  visitStringLiteralExpr(expr: expr.StringLiteral): string {
    // TODO escape " characters
    return `"${expr.value}"`;
  }

  visitBooleanLiteralExpr(expr: expr.BooleanLiteral): string {
    return expr.value ? 'true' : 'false';
  }

  visitNullLiteralExpr(expr: expr.NullLiteral): string {
    return 'null';
  }

  visitBinaryExpr(expr: expr.Binary): string {
    const left = expr.left.accept(this);
    const right = expr.right.accept(this);
    return `${left} ${expr.operator.lexeme} ${right}`;
  }

  visitGroupingExpr(expr: expr.Grouping): string {
    return `(${expr.expression.accept(this)})`;
  }

  visitUnaryExpr(expr: expr.Unary): string {
    return `${expr.operator.lexeme}${expr.right.accept(this)}`;
  }

  visitVariableExpr(expr: expr.Variable): string {
    return `$${expr.name}`;
  }
}
