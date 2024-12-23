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
  visitWhileStmt(stmt: While): T;
  visitForStmt(stmt: For): T;
  visitForeachStmt(stmt: Foreach): T;
  visitFunctionStmt(stmt: Function): T;
  visitReturnStmt(stmt: Return): T;
  visitClassStmt(stmt: Class): T;
  visitConstStmt(stmt: ClassConst): T;
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
    public readonly name: Token | string,
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

export class While extends Stmt {
  constructor(public readonly condition: Expr, public readonly body: Stmt) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitWhileStmt(this);
  }
}

export class For extends Stmt {
  constructor(
    public readonly initializer: Stmt | null,
    public readonly condition: Expr | null,
    public readonly increment: Expr | null,
    public readonly body: Stmt,
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitForStmt(this);
  }
}

export class Foreach extends Stmt {
  constructor(
    public readonly key: Var | null,
    public readonly value: Var,
    public readonly iterable: Expr,
    public readonly body: Stmt,
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitForeachStmt(this);
  }
}

export class Function extends Stmt {
  constructor(
    public readonly name: Token,
    public readonly params: Var[],
    public readonly returnType: Type | null,
    public readonly body: Stmt[] | Expr,
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFunctionStmt(this);
  }
}

export class Return extends Stmt {
  constructor(public readonly value: Expr | null) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitReturnStmt(this);
  }
}

export class Class extends Stmt {
  constructor(
    public readonly name: string,
    public readonly params: Var[],
    public readonly superclass: string | null,
    public readonly interfaces: string[],
    public readonly members: Array<Function | Var | ClassConst>,
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassStmt(this);
  }
}

export class ClassConst extends Stmt {
  constructor(public readonly variable: Var) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitConstStmt(this);
  }
}
