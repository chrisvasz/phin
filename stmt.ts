import { Expr } from './expr';
import { Token } from './Token';
import { Type } from './type';

function indent(depth: number): string {
  return '  '.repeat(depth);
}

export abstract class Stmt {
  abstract accept<T>(visitor: Visitor<T>): T;
}

export interface Visitor<T> {
  visitBlockStmt(stmt: Block): T;
  visitIfStmt(stmt: If): T;
  visitVarStmt(stmt: Var): T;
  visitEchoStmt(stmt: Echo): T;
  visitExpressionStmt(stmt: Expression): T;
}

export class If extends Stmt {
  constructor(
    public readonly condition: Expr,
    public readonly thenBranch: Stmt,
    public readonly elseBranch: Stmt | null,
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIfStmt(this);
  }
}

export class Block extends Stmt {
  constructor(public readonly statements: Stmt[]) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBlockStmt(this);
  }
}

export class Var extends Stmt {
  constructor(
    public readonly name: Token,
    public readonly type: Type | null,
    public readonly initializer: Expr | null,
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitVarStmt(this);
  }
}

export class Echo extends Stmt {
  constructor(public readonly expression: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitEchoStmt(this);
  }
}

export class Expression extends Stmt {
  constructor(public readonly expression: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitExpressionStmt(this);
  }
}
