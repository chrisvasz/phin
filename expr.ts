import { Token } from './Token';

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
}

export abstract class Expr {
  abstract accept<T>(visitor: Visitor<T>): T;
  abstract toString(depth?: number): string;
}

export class Assign extends Expr {
  constructor(public readonly name: Token, public readonly value: Expr) {
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
    public readonly operator: Token,
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
  constructor(public readonly operator: Token, public readonly right: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitUnaryExpr(this);
  }
  toString(depth = 0) {
    const { operator, right } = this;
    const lexeme = operator.lexeme;
    return `${indent(depth)}Unary ${lexeme} ${right.toString(depth + 1)}`;
  }
}

export class Variable extends Expr {
  constructor(public readonly name: Token) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitVariableExpr(this);
  }
  toString(depth = 0): string {
    return indent(depth) + this.name.lexeme;
  }
}
