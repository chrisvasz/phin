import { Type } from './type';
import * as stmt from './stmt';
import { Stmt } from './stmt';

function indent(depth: number): string {
  return '  '.repeat(depth);
}

export interface Visitor<T> {
  visitAssignExpr(expr: Assign): T;
  visitCallExpr(expr: Call): T;
  visitGetExpr(expr: Get): T;
  visitOptionalGetExpr(expr: OptionalGet): T;
  visitBinaryExpr(expr: Binary): T;
  visitGroupingExpr(expr: Grouping): T;
  visitNumberLiteralExpr(expr: NumberLiteral): T;
  visitStringLiteralExpr(expr: StringLiteral): T;
  visitBooleanLiteralExpr(expr: BooleanLiteral): T;
  visitNullLiteralExpr(expr: NullLiteral): T;
  visitArrayLiteralExpr(expr: ArrayLiteral): T;
  visitArrayElementExpr(expr: ArrayElement): T;
  visitUnaryExpr(expr: Unary): T;
  visitVariableExpr(expr: Variable): T;
  visitFunctionExpr(expr: Function): T;
  visitNewExpr(expr: New): T;
  visitMatchExpr(expr: Match): T;
  visitMatchArmExpr(expr: MatchArm): T;
  visitThrowExpr(expr: Throw): T;
}

export abstract class Expr {
  abstract accept<T>(visitor: Visitor<T>): T;
}

export class Assign extends Expr {
  constructor(public readonly name: string, public readonly value: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitAssignExpr(this);
  }
}

export class Call extends Expr {
  constructor(public readonly callee: Expr, public readonly args: Expr[]) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitCallExpr(this);
  }
}

export class Get extends Expr {
  constructor(public readonly object: Expr, public readonly name: string) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitGetExpr(this);
  }
}

export class OptionalGet extends Expr {
  constructor(public readonly object: Expr, public readonly name: string) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitOptionalGetExpr(this);
  }
}

export class Binary extends Expr {
  constructor(
    public readonly left: Expr,
    public readonly operator: string,
    public readonly right: Expr,
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBinaryExpr(this);
  }
}

export class Grouping extends Expr {
  constructor(public readonly expression: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitGroupingExpr(this);
  }
}

export class NumberLiteral extends Expr {
  constructor(public readonly value: string) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNumberLiteralExpr(this);
  }
}

export class StringLiteral extends Expr {
  constructor(public readonly value: string) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitStringLiteralExpr(this);
  }
}

export class BooleanLiteral extends Expr {
  constructor(public readonly value: boolean) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBooleanLiteralExpr(this);
  }
}

export class NullLiteral extends Expr {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNullLiteralExpr(this);
  }
}

export class ArrayLiteral extends Expr {
  constructor(public readonly elements: ArrayElement[]) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitArrayLiteralExpr(this);
  }
}

export class ArrayElement extends Expr {
  constructor(
    public readonly key: NumberLiteral | StringLiteral | null,
    public readonly value: Expr,
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitArrayElementExpr(this);
  }
}

export class Unary extends Expr {
  constructor(public readonly operator: string, public readonly right: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitUnaryExpr(this);
  }
}

export class Variable extends Expr {
  constructor(public readonly name: string) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitVariableExpr(this);
  }
}

export class Function extends Expr {
  constructor(
    public readonly params: stmt.Var[],
    public readonly returnType: Type | null,
    public readonly body: Expr | Stmt[],
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFunctionExpr(this);
  }
}

export class New extends Expr {
  constructor(public readonly expression: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNewExpr(this);
  }
}

export class Match extends Expr {
  constructor(
    public readonly subject: Expr,
    public readonly arms: MatchArm[],
    public readonly defaultArm: Expr | null,
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitMatchExpr(this);
  }
}

export class MatchArm extends Expr {
  constructor(public readonly patterns: Expr[], public readonly body: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitMatchArmExpr(this);
  }
}

export class Throw extends Expr {
  constructor(public readonly expression: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitThrowExpr(this);
  }
}
