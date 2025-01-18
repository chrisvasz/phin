import parse from '../parser'
import { Program } from '../nodes'
import scan from '../scanner'
import BindIdentifiersVisitor from './BindIdentifiersVisitor'
import { HoistedSymbols, Symbols } from '../symbols'
import TypeCheckVisitor from './TypeCheckVisitor'

export default function compile(
  source: string,
  {
    buildEnvironment = true,
    symbols = new HoistedSymbols(),
    typecheck = true,
  }: {
    buildEnvironment?: boolean // TODO can we drop this?
    symbols?: Symbols
    typecheck?: boolean // TODO can we drop this?
  } = {},
): Program {
  let ast = parse(scan(source), { buildEnvironment })
  // TODO is there any way to indicate with types that node is set after this?
  new BindIdentifiersVisitor(symbols).visit(ast)
  if (typecheck) {
    // TODO is there any way to indicate with types that type is set after this?
    new TypeCheckVisitor(ast).visit()
  }
  return ast
}
