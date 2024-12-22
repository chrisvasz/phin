import { Token } from './Token';

export abstract class Stmt {
  abstract accept<T>(visitor: Visitor<T>): T;
}

export abstract class Expr {
  abstract accept<T>(visitor: Visitor<T>): T;
}

export interface Visitor<T> {
  visitVarStatement(stmt: VarStatement): T;
  visitEchoStatement(stmt: EchoStatement): T;
  visitExpressionStatement(stmt: ExpressionStatement): T;
  visitAssign(expr: Assign): T;
  visitBinary(expr: Binary): T;
  visitGrouping(expr: Grouping): T;
  visitNumberLiteral(expr: NumberLiteral): T;
  visitStringLiteral(expr: StringLiteral): T;
  visitBooleanLiteral(expr: BooleanLiteral): T;
  visitNullLiteral(expr: NullLiteral): T;
  visitUnary(expr: Unary): T;
  visitVariable(expr: Variable): T;
}

export class VarStatement extends Stmt {
  constructor(
    public readonly name: Token,
    public readonly initializer: Expr | null,
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitVarStatement(this);
  }
}

export class EchoStatement extends Stmt {
  constructor(public readonly expression: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitEchoStatement(this);
  }
}

export class ExpressionStatement extends Stmt {
  constructor(public readonly expression: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitExpressionStatement(this);
  }
}

export class Assign extends Expr {
  constructor(public readonly name: Token, public readonly value: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitAssign(this);
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
    return visitor.visitBinary(this);
  }
}

export class Grouping extends Expr {
  constructor(public readonly expression: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitGrouping(this);
  }
}

export class NumberLiteral extends Expr {
  constructor(public readonly value: number) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNumberLiteral(this);
  }
}

export class StringLiteral extends Expr {
  constructor(public readonly value: string) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitStringLiteral(this);
  }
}

export class BooleanLiteral extends Expr {
  constructor(public readonly value: boolean) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBooleanLiteral(this);
  }
}

export class NullLiteral extends Expr {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNullLiteral(this);
  }
}

export class Unary extends Expr {
  constructor(public readonly operator: Token, public readonly right: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitUnary(this);
  }
}

export class Variable extends Expr {
  constructor(public readonly name: Token) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitVariable(this);
  }
}
