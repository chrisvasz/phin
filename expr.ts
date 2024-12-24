import { Type } from './type';
import * as stmt from './stmt';
import { Stmt } from './stmt';

function indent(depth: number): string {
  return '  '.repeat(depth);
}

export interface Visitor<T> {
  visitAssignExpr(expr: Assign): T;
  visitCallExpr(expr: Call): T;
  visitBinaryExpr(expr: Binary): T;
  visitGroupingExpr(expr: Grouping): T;
  visitNumberLiteralExpr(expr: NumberLiteral): T;
  visitStringLiteralExpr(expr: StringLiteral): T;
  visitBooleanLiteralExpr(expr: BooleanLiteral): T;
  visitNullLiteralExpr(expr: NullLiteral): T;
  visitUnaryExpr(expr: Unary): T;
  visitVariableExpr(expr: Variable): T;
  visitFunctionExpr(expr: Function): T;
  visitNewExpr(expr: New): T;
  visitMatchExpr(expr: Match): T;
  visitMatchArmExpr(expr: MatchArm): T;
}

export abstract class Expr {
  abstract accept<T>(visitor: Visitor<T>): T;
  abstract toString(depth?: number): string;
}

export class Assign extends Expr {
  constructor(public readonly name: string, public readonly value: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitAssignExpr(this);
  }
  toString(depth?: number): string {
    return 'TODO';
  }
}

export class Call extends Expr {
  constructor(public readonly callee: Expr, public readonly args: Expr[]) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitCallExpr(this);
  }
  toString(depth?: number): string {
    return 'TODO';
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
  toString(depth?: number): string {
    return 'TODO';
  }
}

export class Grouping extends Expr {
  constructor(public readonly expression: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitGroupingExpr(this);
  }
  toString(depth?: number): string {
    return 'TODO';
  }
}

export class NumberLiteral extends Expr {
  constructor(public readonly value: number) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNumberLiteralExpr(this);
  }
  toString(depth?: number): string {
    return 'TODO';
  }
}

export class StringLiteral extends Expr {
  constructor(public readonly value: string) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitStringLiteralExpr(this);
  }
  toString(depth?: number): string {
    return 'TODO';
  }
}

export class BooleanLiteral extends Expr {
  constructor(public readonly value: boolean) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBooleanLiteralExpr(this);
  }
  toString(depth?: number): string {
    return 'TODO';
  }
}

export class NullLiteral extends Expr {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNullLiteralExpr(this);
  }
  toString(depth = 0) {
    return indent(depth) + 'NullLiteral';
  }
}

export class Unary extends Expr {
  constructor(public readonly operator: string, public readonly right: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitUnaryExpr(this);
  }
  toString(depth = 0) {
    const { operator, right } = this;
    return `${indent(depth)}Unary ${operator} ${right.toString(depth + 1)}`;
  }
}

export class Variable extends Expr {
  constructor(public readonly name: string) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitVariableExpr(this);
  }
  toString(depth = 0): string {
    return indent(depth) + this.name;
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
  toString(depth?: number): string {
    return 'TODO';
  }
}

export class New extends Expr {
  constructor(public readonly expression: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNewExpr(this);
  }
  toString(depth?: number): string {
    return 'TODO';
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
  toString(depth?: number): string {
    return 'TODO';
  }
}

export class MatchArm extends Expr {
  constructor(public readonly patterns: Expr[], public readonly body: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitMatchArmExpr(this);
  }
  toString(depth?: number): string {
    return 'TODO';
  }
}
