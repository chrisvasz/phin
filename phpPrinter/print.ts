import * as stmt from '../stmt';
import { Stmt } from '../stmt';
import * as expr from '../expr';
import { Expr } from '../expr';
import * as types from '../type';

export class PhpPrinter
  implements expr.Visitor<string>, stmt.Visitor<string>, types.Visitor<string>
{
  print(statements: stmt.Stmt[]): string {
    return statements.map(s => s.accept(this)).join('\n');
  }

  /////////////////////////////
  // TYPES
  /////////////////////////////

  visitBooleanType(boolean: types.Boolean): string {
    throw new Error('Method not implemented.');
  }
  visitFalseType(false_: types.False): string {
    throw new Error('Method not implemented.');
  }
  visitFloatType(float: types.Float): string {
    throw new Error('Method not implemented.');
  }
  visitIdentifierType(identifier: types.Identifier): string {
    throw new Error('Method not implemented.');
  }
  visitIntersectionType(intersection: types.Intersection): string {
    throw new Error('Method not implemented.');
  }
  visitIntType(int: types.Int): string {
    return 'int';
  }
  visitNullableType(nullable: types.Nullable): string {
    throw new Error('Method not implemented.');
  }
  visitNullType(null_: types.Null): string {
    throw new Error('Method not implemented.');
  }
  visitNumberLiteralType(numberLiteral: types.NumberLiteral): string {
    throw new Error('Method not implemented.');
  }
  visitNumberType(number: types.Number): string {
    return 'number';
  }
  visitStringLiteralType(stringLiteral: types.StringLiteral): string {
    throw new Error('Method not implemented.');
  }
  visitStringType(string: types.String): string {
    throw new Error('Method not implemented.');
  }
  visitTrueType(true_: types.True): string {
    throw new Error('Method not implemented.');
  }
  visitUnionType(union: types.Union): string {
    throw new Error('Method not implemented.');
  }

  /////////////////////////////
  // STATEMENTS
  /////////////////////////////

  visitAbstractClassMethodStmt(stmt: stmt.AbstractClassMethod): string {
    throw new Error('Method not implemented.');
  }
  visitArrayElementExpr(expr: expr.ArrayElement): string {
    throw new Error('Method not implemented.');
  }
  visitArrayLiteralExpr(expr: expr.ArrayLiteral): string {
    throw new Error('Method not implemented.');
  }
  visitAssignExpr(expr: expr.Assign): string {
    throw new Error('Method not implemented.');
  }
  visitBinaryExpr(expr: expr.Binary): string {
    let left = expr.left.accept(this);
    let right = expr.right.accept(this);
    return `${left} ${expr.operator} ${right}`;
  }
  visitBlockStmt(stmt: stmt.Block): string {
    throw new Error('Method not implemented.');
  }
  visitBooleanLiteralExpr(expr: expr.BooleanLiteral): string {
    throw new Error('Method not implemented.');
  }
  visitCallExpr(expr: expr.Call): string {
    throw new Error('Method not implemented.');
  }
  visitCatchStmt(stmt: stmt.Catch): string {
    throw new Error('Method not implemented.');
  }
  visitClassConstStmt(stmt: stmt.ClassConst): string {
    throw new Error('Method not implemented.');
  }
  visitClassInitializerStmt(stmt: stmt.ClassInitializer): string {
    throw new Error('Method not implemented.');
  }
  visitClassMethodStmt(stmt: stmt.ClassMethod): string {
    throw new Error('Method not implemented.');
  }
  visitClassParamStmt(stmt: stmt.ClassParam): string {
    throw new Error('Method not implemented.');
  }
  visitClassPropertyStmt(stmt: stmt.ClassProperty): string {
    throw new Error('Method not implemented.');
  }
  visitClassStmt(stmt: stmt.Class): string {
    throw new Error('Method not implemented.');
  }
  visitClassSuperclassStmt(stmt: stmt.ClassSuperclass): string {
    throw new Error('Method not implemented.');
  }
  visitCloneExpr(expr: expr.Clone): string {
    throw new Error('Method not implemented.');
  }
  visitEchoStmt(stmt: stmt.Echo): string {
    throw new Error('Method not implemented.');
  }
  visitExpressionStmt(stmt: stmt.Expression): string {
    throw new Error('Method not implemented.');
  }
  visitForeachStmt(stmt: stmt.Foreach): string {
    throw new Error('Method not implemented.');
  }
  visitForStmt(stmt: stmt.For): string {
    throw new Error('Method not implemented.');
  }
  visitFunctionExpr(expr: expr.Function): string {
    throw new Error('Method not implemented.');
  }
  visitFunctionStmt(stmt: stmt.Function): string {
    throw new Error('Method not implemented.');
  }
  visitGetExpr(expr: expr.Get): string {
    throw new Error('Method not implemented.');
  }
  visitGroupingExpr(expr: expr.Grouping): string {
    throw new Error('Method not implemented.');
  }
  visitIdentifierExpr(expr: expr.Identifier): string {
    throw new Error('Method not implemented.');
  }
  visitIfStmt(stmt: stmt.If): string {
    throw new Error('Method not implemented.');
  }
  visitMatchArmExpr(expr: expr.MatchArm): string {
    throw new Error('Method not implemented.');
  }
  visitMatchExpr(expr: expr.Match): string {
    throw new Error('Method not implemented.');
  }
  visitNewExpr(expr: expr.New): string {
    throw new Error('Method not implemented.');
  }
  visitNullLiteralExpr(expr: expr.NullLiteral): string {
    throw new Error('Method not implemented.');
  }
  visitNumberLiteralExpr(expr: expr.NumberLiteral): string {
    return expr.value;
  }
  visitOptionalGetExpr(expr: expr.OptionalGet): string {
    throw new Error('Method not implemented.');
  }
  visitPostfixExpr(expr: expr.Postfix): string {
    throw new Error('Method not implemented.');
  }
  visitPrefixExpr(expr: expr.Prefix): string {
    throw new Error('Method not implemented.');
  }
  visitReturnStmt(stmt: stmt.Return): string {
    throw new Error('Method not implemented.');
  }
  visitStringLiteralExpr(expr: expr.StringLiteral): string {
    throw new Error('Method not implemented.');
  }
  visitSuperExpr(): string {
    throw new Error('Method not implemented.');
  }
  visitTernaryExpr(expr: expr.Ternary): string {
    throw new Error('Method not implemented.');
  }
  visitThisExpr(): string {
    throw new Error('Method not implemented.');
  }
  visitThrowExpr(expr: expr.Throw): string {
    throw new Error('Method not implemented.');
  }
  visitThrowStmt(stmt: stmt.Throw): string {
    throw new Error('Method not implemented.');
  }
  visitTryStmt(stmt: stmt.Try): string {
    throw new Error('Method not implemented.');
  }
  visitUnaryExpr(expr: expr.Unary): string {
    throw new Error('Method not implemented.');
  }
  visitVarStmt(stmt: stmt.Var): string {
    let type = stmt.type
      ? `/** @var ${stmt.type.accept(this)} $${stmt.name} */\n`
      : '';
    let init = stmt.initializer ? ` = ${stmt.initializer.accept(this)}` : '';
    return `${type}$${stmt.name}${init};`;
  }
  visitWhileStmt(stmt: stmt.While): string {
    throw new Error('Method not implemented.');
  }
}
