import parse from '../parser'
import { Program } from '../nodes'
import scan from '../scanner'
import BindIdentifiersVisitor from './BindIdentifiersVisitor'
import { HoistedSymbols, Symbols } from '../symbols'

export default function compile(
  source: string,
  {
    buildEnvironment = true,
    symbols = new HoistedSymbols(),
  }: {
    buildEnvironment?: boolean
    symbols?: Symbols
  } = {},
): Program {
  let ast = parse(scan(source), { buildEnvironment })
  new BindIdentifiersVisitor(symbols).visit(ast)
  return ast
}
