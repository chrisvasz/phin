export interface Visitor<T> {
  visitNumberType(number: Number): T
  visitStringType(string: String): T
  visitBooleanType(boolean: Boolean): T
  visitIntType(int: Int): T
  visitFloatType(float: Float): T
  visitNullType(null_: Null): T
  visitIdentifierType(identifier: Identifier): T
  visitNumberLiteralType(numberLiteral: NumberLiteral): T
  visitStringLiteralType(stringLiteral: StringLiteral): T
  visitTrueType(true_: True): T
  visitFalseType(false_: False): T
  visitNullableType(nullable: Nullable): T
  visitUnionType(union: Union): T
  visitIntersectionType(intersection: Intersection): T
  visitVoidType(void_: Void): T
}

const returnTrue = () => true
function returnThis(this: Type): Type {
  return this
}

export abstract class Type {
  abstract accept<T>(visitor: Visitor<T>): T
  isAssignableTo(other: Type) {
    return this instanceof other.constructor
  }
  equals(other: Type) {
    // TODO override this in subclasses, esp literals
    return this instanceof other.constructor
  }
  isExpressibleInPhp: () => boolean = returnTrue
  simplify: () => Type = returnThis
}

export class Number extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNumberType(this)
  }
}

export class String extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitStringType(this)
  }
  override toString() {
    return 'string'
  }
}

export class Boolean extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBooleanType(this)
  }
}

export class Int extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIntType(this)
  }
}

export class Float extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFloatType(this)
  }
}

export class Null extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNullType(this)
  }
  override toString() {
    return 'null'
  }
}

function hasNoGenerics(this: Identifier) {
  return this.generics.length === 0
}

function simplifyIdentifier(this: Identifier) {
  return this.generics.length === 0 ? this : new Identifier(this.name, [])
}

export class Identifier extends Type {
  constructor(
    public readonly name: string,
    public readonly generics: Type[],
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIdentifierType(this)
  }
  override isExpressibleInPhp = hasNoGenerics
  override simplify = simplifyIdentifier
}

export class NumberLiteral extends Type {
  constructor(public readonly value: string) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNumberLiteralType(this)
  }
}

export class StringLiteral extends Type {
  constructor(public readonly value: string) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitStringLiteralType(this)
  }
  override toString() {
    return 'stringLiteral'
  }
}

export class True extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTrueType(this)
  }
}

export class False extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFalseType(this)
  }
}

// TODO needs an override for isExpressibleInPhp and simplify
export class Nullable extends Type {
  constructor(public readonly type: Type) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNullableType(this)
  }
}

// TODO needs an override for isExpressibleInPhp and simplify
export class Union extends Type {
  constructor(public readonly types: Type[]) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitUnionType(this)
  }
}

// TODO needs an override for isExpressibleInPhp and simplify
export class Intersection extends Type {
  constructor(public readonly types: Type[]) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIntersectionType(this)
  }
}

export class Void extends Type {
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitVoidType(this)
  }
}
