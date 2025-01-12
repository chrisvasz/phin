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
    buildEnvironment?: boolean
    symbols?: Symbols
    typecheck?: boolean // TODO maybe remove this?
  } = {},
): Program {
  let ast = parse(scan(source), { buildEnvironment })
  new BindIdentifiersVisitor(symbols).visit(ast) // TODO is there any way to indicate with types that node is set after this?
  if (typecheck) {
    new TypeCheckVisitor().visit(ast) // TODO is there any way to indicate with types that type is set after this?
  }
  return ast
}
