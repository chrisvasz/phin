export interface Visitor<T> {
  visitNumberType(number: Number): T;
  visitStringType(string: String): T;
  visitBooleanType(boolean: Boolean): T;
  visitIntType(int: Int): T;
  visitFloatType(float: Float): T;
  visitNullType(null_: Null): T;
  visitIdentifierType(identifier: Identifier): T;
  visitNumberLiteralType(numberLiteral: NumberLiteral): T;
  visitStringLiteralType(stringLiteral: StringLiteral): T;
  visitTrueType(true_: True): T;
  visitFalseType(false_: False): T;
  visitNullableType(nullable: Nullable): T;
  visitUnionType(union: Union): T;
  visitIntersectionType(intersection: Intersection): T;
}

export abstract class Type {
  abstract accept<T>(visitor: Visitor<T>): T;
}

export class Number extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNumberType(this);
  }
}

export class String extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitStringType(this);
  }
}

export class Boolean extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBooleanType(this);
  }
}

export class Int extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIntType(this);
  }
}

export class Float extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFloatType(this);
  }
}

export class Null extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNullType(this);
  }
}

export class Identifier extends Type {
  constructor(public readonly name: string, public readonly generics: Type[]) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIdentifierType(this);
  }
}

export class NumberLiteral extends Type {
  constructor(public readonly value: string) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNumberLiteralType(this);
  }
}

export class StringLiteral extends Type {
  constructor(public readonly value: string) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitStringLiteralType(this);
  }
}

export class True extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTrueType(this);
  }
}

export class False extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFalseType(this);
  }
}

export class Nullable extends Type {
  constructor(public readonly type: Type) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNullableType(this);
  }
}

export class Union extends Type {
  constructor(public readonly types: Type[]) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitUnionType(this);
  }
}

export class Intersection extends Type {
  constructor(public readonly types: Type[]) {
    super();
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIntersectionType(this);
  }
}
