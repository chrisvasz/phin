export interface Visitor<T> {
  visitAnyType(any: Any): T
  visitBooleanType(boolean: Boolean): T
  visitFalseType(false_: False): T
  visitFloatLiteralType(float: Float): T
  visitFloatType(float: Float): T
  visitFunctionType(function_: Function): T
  visitIdentifierType(identifier: Identifier): T
  visitIntersectionType(intersection: Intersection): T
  visitIntLiteralType(intLiteral: IntLiteral): T
  visitIntType(int: Int): T
  visitNullableType(nullable: Nullable): T
  visitNullType(null_: Null): T
  visitStringLiteralType(stringLiteral: StringLiteral): T
  visitStringType(string: String): T
  visitTrueType(true_: True): T
  visitUnionType(union: Union): T
  visitVoidType(void_: Void): T
}

const returnTrue = () => true
function returnThis(this: Type): Type {
  return this
}

// TODO unit tests for assignability and equality

export abstract class Type {
  abstract _name: string
  abstract accept<T>(visitor: Visitor<T>): T
  isAssignableTo(other: Type) {
    // TODO override this in subclasses, esp literals
    return this instanceof other.constructor
  }
  equals(other: Type) {
    // TODO override this in subclasses, esp literals
    return this instanceof other.constructor
  }
  isExpressibleInPhp: () => boolean = returnTrue
  simplify: () => Type = returnThis
}

export class Any extends Type {
  _name = 'Any'
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitAnyType(this)
  }
  override toString() {
    return 'any'
  }
}

export class String extends Type {
  _name = 'String'
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitStringType(this)
  }
  override toString() {
    return 'string'
  }
}

export class Boolean extends Type {
  _name = 'Boolean'
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBooleanType(this)
  }
}

export class Int extends Type {
  _name = 'Int'
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIntType(this)
  }
}

export class Float extends Type {
  _name = 'Float'
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFloatType(this)
  }
}

export class Null extends Type {
  _name = 'Null'
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
  _name = 'Identifier'
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

export class IntLiteral extends Type {
  _name = 'IntLiteral'
  constructor(public readonly value: string) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIntLiteralType(this)
  }
}

export class FloatLiteral extends Type {
  _name = 'FloatLiteral'
  constructor(public readonly value: string) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFloatLiteralType(this)
  }
}

export class StringLiteral extends Type {
  _name = 'StringLiteral'
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
  _name = 'True'
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTrueType(this)
  }
}

export class False extends Type {
  _name = 'False'
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFalseType(this)
  }
}

// TODO needs an override for isExpressibleInPhp and simplify
export class Nullable extends Type {
  _name = 'Nullable'
  constructor(public readonly type: Type) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitNullableType(this)
  }
}

// TODO needs an override for isExpressibleInPhp and simplify
export class Union extends Type {
  _name = 'Union'
  constructor(public readonly types: Type[]) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitUnionType(this)
  }
}

// TODO needs an override for isExpressibleInPhp and simplify
export class Intersection extends Type {
  _name = 'Intersection'
  constructor(public readonly types: Type[]) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIntersectionType(this)
  }
}

export class Void extends Type {
  _name = 'Void'
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitVoidType(this)
  }
}

export class Function extends Type {
  _name = 'Function'
  constructor(
    public readonly params: Type[],
    public readonly returnType: Type,
  ) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFunctionType(this)
  }
  override equals(other: Type) {
    if (!(other instanceof Function)) return false
    if (this.params.length !== other.params.length) return false
    for (let i = 0; i < this.params.length; i++) {
      if (!this.params[i].equals(other.params[i])) return false
    }
    return this.returnType.equals(other.returnType)
  }
  override toString() {
    return `(${this.params.join(', ')}) => ${this.returnType}`
  }
}
