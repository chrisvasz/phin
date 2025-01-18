import * as n from './nodes'

export interface Visitor<T> {
  visitAnyType(any: Any): T
  visitArrayType(array: Array): T
  visitBooleanType(boolean: Boolean): T
  visitInstanceType(class_: Instance): T
  visitFalseType(false_: False): T
  visitFloatLiteralType(float: FloatLiteral): T
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

// TODO unit tests for assignability and equality

export abstract class Type {
  abstract _name: string
  abstract accept<T>(visitor: Visitor<T>): T
  contains(other: Type): boolean {
    return this.equals(other)
  }
  equals(other: Type) {
    // TODO override this in subclasses, esp literals
    return this instanceof other.constructor
  }
  isExpressibleInPhp(): boolean {
    return true
  }
  simplify(): Type {
    return this
  }
}

export class Instance extends Type {
  _name = 'Class'
  constructor(public readonly node: n.ClassDeclaration) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitInstanceType(this)
  }
}

export class Any extends Type {
  _name = 'Any'
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitAnyType(this)
  }
  override contains(other: Type): boolean {
    return true
  }
  override toString() {
    return 'any'
  }
}

export class Array extends Type {
  _name = 'Array'
  constructor(public readonly type: Type) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitArrayType(this)
  }
  override toString() {
    return `array<${this.type}>`
  }
}

export class String extends Type {
  _name = 'String'
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitStringType(this)
  }
  override contains(other: Type): boolean {
    return other instanceof String || other instanceof StringLiteral
  }
  override toString() {
    return 'string'
  }
}

export class Boolean extends Type {
  _name = 'Boolean'
  override contains(other: Type) {
    return (
      other instanceof Boolean ||
      other instanceof True ||
      other instanceof False
    )
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBooleanType(this)
  }
}

export class Int extends Type {
  _name = 'Int'
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIntType(this)
  }
  override contains(other: Type): boolean {
    return other instanceof Int || other instanceof IntLiteral
  }
  override toString() {
    return 'int'
  }
}

export class Float extends Type {
  _name = 'Float'
  override contains(other: Type) {
    return other instanceof Float || other instanceof FloatLiteral
  }
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
}

export class IntLiteral extends Type {
  _name = 'IntLiteral'
  constructor(public readonly value: string) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIntLiteralType(this)
  }
  override equals(other: Type): boolean {
    return other instanceof IntLiteral && this.value === other.value
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
  override equals(other: Type): boolean {
    return other instanceof FloatLiteral && this.value === other.value
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
  override equals(other: Type): boolean {
    return other instanceof StringLiteral && this.value === other.value
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

  override contains(other: Type): boolean {
    return (
      super.contains(other) ||
      other instanceof Null ||
      this.type.contains(other)
    )
  }

  override equals(other: Type): boolean {
    return other instanceof Nullable && this.type.equals(other.type)
  }

  override toString() {
    return `?${this.type}`
  }
}

export class Union extends Type {
  _name = 'Union'
  constructor(public readonly types: Type[]) {
    super()
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitUnionType(this)
  }
  override contains(other: Type): boolean {
    if (other instanceof Union) {
      return other.types.every((type) => this.contains(type))
    }
    return this.types.some((type) => type.contains(other))
  }
  override equals(other: Type): boolean {
    if (!(other instanceof Union)) return false
    if (this.types.length !== other.types.length) return false
    return this.types.every((type) => other.contains(type))
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

  override contains(other: Type): boolean {
    if (!(other instanceof Function)) return false
    if (this.params.length !== other.params.length) return false
    for (let i = 0; i < this.params.length; i++) {
      if (!this.params[i].contains(other.params[i])) return false
    }
    return this.returnType.contains(other.returnType)
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
