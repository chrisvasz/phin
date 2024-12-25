import { Expr } from './expr';
import { Type } from './type';
import * as expr from './expr';

function indent(depth: number): string {
  return '  '.repeat(depth);
}

export abstract class Stmt {
  abstract accept<T>(visitor: Visitor<T>): T;
}

export type Visibility = 'public' | 'protected' | 'private' | null;

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
  visitTryStmt(stmt: Try): T;
  visitCatchStmt(stmt: Catch): T;
  visitThrowStmt(stmt: Throw): T;
  visitClassStmt(stmt: Class): T;
  visitClassParamStmt(stmt: ClassParam): T;
  visitClassSuperclassStmt(stmt: ClassSuperclass): T;
  visitClassPropertyStmt(stmt: ClassProperty): T;
  visitClassConstStmt(stmt: ClassConst): T;
  visitClassInitializerStmt(stmt: ClassInitializer): T;
  visitClassMethodStmt(stmt: ClassMethod): T;
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
    public readonly name: string,
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
    public readonly key: Var | null, // TODO don't use var for this, can't have initializer
    public readonly value: Var, // TODO don't use var for this, can't have initializer
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
    public readonly name: string,
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

export class Try extends Stmt {
  constructor(
    public readonly tryBlock: Stmt[],
    public readonly catches: Catch[],
    public readonly finallyBlock: null | Stmt[],
  ) {
    super();
    if (catches.length === 0 && finallyBlock === null) {
      throw new Error(
        'Try statement must have at least one catch or finally block',
      );
    }
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTryStmt(this);
  }
}

export class Catch extends Stmt {
  constructor(
    public readonly variable: string,
    public readonly types: string[],
    public readonly body: Stmt[],
  ) {
    super();
    if (types.length === 0) {
      throw new Error('Catch variable must have at least one type');
    }
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitCatchStmt(this);
  }
}

export class Throw extends Stmt {
  constructor(public readonly expression: Expr) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitThrowStmt(this);
  }
}

export class Class extends Stmt {
  constructor(
    public readonly name: string,
    public readonly params: ClassParam[],
    public readonly superclass: ClassSuperclass | null,
    public readonly interfaces: string[],
    public readonly members: Array<
      ClassMethod | ClassProperty | ClassConst | ClassInitializer
    >,
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassStmt(this);
  }
}

export class ClassParam extends Stmt {
  constructor(
    public readonly name: string,
    public readonly type: Type | null,
    public readonly initializer: Expr | null,
    public readonly visibility: Visibility,
    public readonly isFinal: boolean,
    public readonly isReadonly: boolean,
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassParamStmt(this);
  }
}

export class ClassSuperclass extends Stmt {
  constructor(public readonly name: string, public readonly args: Expr[]) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassSuperclassStmt(this);
  }
}

export class ClassProperty extends Stmt {
  constructor(
    public readonly variable: Var,
    public readonly visibility: Visibility,
    public readonly isStatic: boolean,
    public readonly isFinal: boolean,
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassPropertyStmt(this);
  }
}

export class ClassMethod extends Stmt {
  constructor(
    public readonly method: Function,
    public readonly visibility: Visibility,
    public readonly isStatic: boolean,
    public readonly isFinal: boolean,
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassMethodStmt(this);
  }
}

export class ClassConst extends Stmt {
  constructor(
    public readonly name: string,
    public readonly type: Type | null,
    public readonly initializer: Expr, // TODO must be compile-time constant
    public readonly visibility: Visibility,
    public readonly isStatic: boolean,
    public readonly isFinal: boolean,
  ) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassConstStmt(this);
  }
}

export class ClassInitializer extends Stmt {
  constructor(public readonly body: Stmt[]) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitClassInitializerStmt(this);
  }
}
