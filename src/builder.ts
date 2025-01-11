// @ts-ignore
import * as nodes from './nodes'
import * as types from './types'
import { ClassEnvironment, HoistedEnvironment } from './symbols'

export const b = (function () {
  return {
    arrayAccess,
    assign,
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
    foreach,
    foreachVariable,
    fun,
    get,
    grouping: (expression: nodes.Expr) => new nodes.Grouping(expression),
    id,
    numberLiteral,
    param,
    pipeline,
    program,
    return: (expression: nodes.Expr) => new nodes.Return(expression),
    stringLiteral: (value: string) => new nodes.StringLiteral(value),
    var: var_,
    varDestructuring,
    destructuring,
    destructuringElement,
  }

  function assign(
    name: nodes.Identifier | nodes.Get | nodes.ArrayAccess,
    operator: string,
    value: nodes.Expr,
  ) {
    return new nodes.Assign(name, operator, value)
  }

  function arrayAccess(left: nodes.Expr, index: nodes.Expr) {
    return new nodes.ArrayAccess(left, index)
  }

  function program(...statements: nodes.Stmt[]) {
    return new nodes.Program(statements, new HoistedEnvironment())
  }

  function pipeline(left: nodes.Expr, right: nodes.Expr) {
    return new nodes.Pipeline(left, right)
  }

  function get(object: nodes.Expr, property: string) {
    return new nodes.Get(object, property)
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

  function foreach(
    key: nodes.ForeachVariable | null,
    value: nodes.ForeachVariable | nodes.Destructuring,
    iterable: nodes.Expr,
    body: nodes.Block,
  ) {
    return new nodes.Foreach(key, value, iterable, body)
  }

  function foreachVariable(name: string, type: types.Type | null = null) {
    return new nodes.ForeachVariable(name, type)
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
      env = new ClassEnvironment(),
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

  function varDestructuring(
    destructuring: nodes.Destructuring,
    initializer: nodes.Expr,
  ) {
    return new nodes.VarDestructuringDeclaration(destructuring, initializer)
  }

  function destructuring(
    ...elements: Array<nodes.DestructuringElement | null>
  ) {
    return new nodes.Destructuring(elements)
  }

  function destructuringElement(
    key: string | null,
    value: string,
    type: types.Type | null = null,
  ) {
    return new nodes.DestructuringElement(key, value, type)
  }
})()

export const t = (function () {
  const any = new types.Any()
  const void_ = new types.Void()
  const bool = new types.Boolean()
  const int = new types.Int()
  const float = new types.Float()
  const number = new types.Number()
  const string = new types.String()
  const null_ = new types.Null()
  const true_ = new types.True()
  const false_ = new types.False()

  return {
    any: () => any, // TODO audit calls
    array,
    bool: () => bool,
    false: () => false_,
    float: () => float,
    fun,
    id,
    int: () => int,
    intersection,
    null: () => null_,
    nullable: (type: types.Type) => new types.Nullable(type),
    number: () => number,
    numberLiteral: (value: string) => new types.NumberLiteral(value),
    true: () => true_,
    string: () => string,
    stringLiteral: (value: string) => new types.StringLiteral(value),
    union,
    void: () => void_,
  }

  function id(name: string, ...generics: types.Type[]) {
    return new types.Identifier(name, generics)
  }

  function array(...generics: types.Type[]) {
    return id('array', ...generics)
  }

  function fun(
    params: Array<types.Type | null>,
    returnType: types.Type | null,
  ) {
    // TODO consider those anys
    return new types.Function(
      params.map((p) => p ?? any),
      returnType ?? t.any(),
    )
  }

  function intersection(...members: types.Type[]) {
    if (members.length === 0) return new types.Void()
    let prev = members[0]
    let unique = [prev]
    for (let i = 1; i < members.length; i++) {
      if (!members[i].equals(prev)) {
        unique.push(members[i])
        prev = members[i]
      }
    }
    if (unique.length === 1) return unique[0]
    return new types.Intersection(unique)
  }

  function union(...elements: types.Type[]) {
    if (elements.length === 0) return new types.Void()
    let prev = elements[0]
    let unique = [prev]
    for (let i = 1; i < elements.length; i++) {
      if (!elements[i].equals(prev)) {
        unique.push(elements[i])
        prev = elements[i]
      }
    }
    if (unique.length === 1) return unique[0]
    return new types.Union(unique)
  }
})()
