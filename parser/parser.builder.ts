// @ts-ignore
import * as nodes from '../nodes'
import * as types from '../types'
import { ClassEnvironment, HoistedEnvironment } from './environment'

export const b = (function () {
  return {
    arrayAccess,
    block,
    binary,
    call,
    class: classDeclaration,
    classConst,
    classInitializer: (block: nodes.Block) => new nodes.ClassInitializer(block),
    classMethod,
    classProperty,
    classSuperclass,
    echo: (expression: nodes.Expr) => new nodes.Echo(expression),
    expressionStatement,
    fun,
    id,
    grouping: (expression: nodes.Expr) => new nodes.Grouping(expression),
    numberLiteral,
    param,
    program,
    return: (expression: nodes.Expr) => new nodes.Return(expression),
    stringLiteral: (value: string) => new nodes.StringLiteral(value),
    var: var_,
  }

  function arrayAccess(left: nodes.Expr, index: nodes.Expr) {
    return new nodes.ArrayAccess(left, index)
  }

  function program(...statements: nodes.Stmt[]) {
    return new nodes.Program(statements, new HoistedEnvironment(null))
  }

  function block(...statements: nodes.Stmt[]) {
    return new nodes.Block(statements)
  }

  function id(name: string) {
    return new nodes.Identifier(name)
  }

  function expressionStatement(expression: nodes.Expr) {
    return new nodes.ExpressionStatement(expression)
  }

  function numberLiteral(value: string | number) {
    return new nodes.NumberLiteral(value.toString())
  }

  function param(
    name: string,
    type: types.Type | null = null,
    initializer: nodes.Expr | null = null,
  ) {
    return new nodes.Param(name, type, initializer)
  }

  function fun<Name extends string | null>(
    name: Name,
    {
      params = [],
      returnType = null,
      body = block(),
    }: {
      params?: nodes.Param[]
      returnType?: types.Type | null
      body?: nodes.Block | nodes.Expr
    } = {},
  ): Name extends string
    ? nodes.FunctionDeclaration
    : nodes.FunctionExpression {
    if (typeof name === 'string') {
      return new nodes.FunctionDeclaration(
        name,
        params,
        returnType,
        body,
      ) as any
    }
    return new nodes.FunctionExpression(params, returnType, body) as any
  }

  function classConst(
    name: string,
    initializer: nodes.Expr,
    {
      isFinal = false,
      visibility = null,
      isStatic = false,
      type = null,
    }: {
      isFinal?: boolean
      visibility?: nodes.Visibility
      isStatic?: boolean
      type?: types.Type | null
    } = {},
  ) {
    return new nodes.ClassConst(
      isFinal,
      visibility,
      isStatic,
      name,
      type,
      initializer,
    )
  }

  function classDeclaration(
    name: string,
    {
      params = [],
      constructorVisibility = null,
      superclass,
      interfaces = [],
      iterates = null,
      members = [],
      isAbstract = false,
      env = new ClassEnvironment(null),
    }: {
      params?: Array<nodes.Param | nodes.ClassProperty>
      constructorVisibility?: nodes.Visibility
      superclass?: nodes.ClassSuperclass
      interfaces?: string[]
      iterates?: nodes.Identifier | null
      members?: nodes.ClassMember[]
      isAbstract?: boolean
      env?: ClassEnvironment
    } = {},
  ): nodes.ClassDeclaration {
    return new nodes.ClassDeclaration(
      name,
      constructorVisibility,
      params,
      superclass ?? null,
      interfaces,
      iterates,
      members,
      isAbstract,
      env,
    )
  }

  function classMethod(
    name: string,
    {
      isFinal = false,
      visibility = null,
      isStatic = false,
      params = [],
      returnType = null,
      body = block(),
    }: {
      isFinal?: boolean
      visibility?: nodes.Visibility
      isStatic?: boolean
      params?: Array<nodes.Param>
      returnType?: types.Type | null
      body?: nodes.Block | nodes.Expr
    } = {},
  ) {
    return new nodes.ClassMethod(
      isFinal,
      visibility,
      isStatic,
      name,
      params,
      returnType,
      body,
    )
  }

  function classProperty(
    name: string,
    {
      isFinal = false,
      visibility = null,
      isReadonly = false,
      type = null,
      initializer = null,
    }: {
      isFinal?: boolean
      visibility?: nodes.Visibility
      isReadonly?: boolean
      type?: types.Type | null
      initializer?: nodes.Expr | null
    } = {},
  ) {
    return new nodes.ClassProperty(
      isFinal,
      visibility,
      false, // TODO
      isReadonly,
      name,
      type,
      initializer,
    )
  }

  function classSuperclass(name: string, ...args: nodes.Expr[]) {
    return new nodes.ClassSuperclass(name, args)
  }

  function call(callee: nodes.Expr | string, ...args: nodes.Expr[]) {
    if (typeof callee === 'string') callee = id(callee)
    return new nodes.Call(callee, args)
  }

  function binary(left: nodes.Expr, operator: string, right: nodes.Expr) {
    return new nodes.Binary(left, operator, right)
  }

  function var_(
    name: string,
    type: types.Type | null = null,
    initializer: nodes.Expr | null = null,
  ) {
    return new nodes.VarDeclaration(name, type, initializer)
  }
})()

export const t = (function () {
  return {
    array,
    bool: () => new types.Boolean(),
    false: () => new types.False(),
    float: () => new types.Float(),
    id,
    int: () => new types.Int(),
    intersection: (...members: types.Type[]) => new types.Intersection(members),
    null: () => new types.Null(),
    nullable: (type: types.Type) => new types.Nullable(type),
    number: () => new types.Number(),
    numberLiteral: (value: string) => new types.NumberLiteral(value),
    true: () => new types.True(),
    string: () => new types.String(),
    stringLiteral: (value: string) => new types.StringLiteral(value),
    union: (...members: types.Type[]) => new types.Union(members),
  }

  function id(name: string, ...generics: types.Type[]) {
    return new types.Identifier(name, generics)
  }

  function array(type: types.Type) {
    return id('array', type)
  }
})()
