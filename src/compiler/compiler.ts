import parse from '../parser'
import { Program } from '../nodes'
import scan from '../scanner'
import BindIdentifiersVisitor, {
  defaultResolveUndeclaredIdentifier,
} from './BindIdentifiersVisitor'
import { Symbol, SymbolKind } from '../symbols'
import { t } from '../builder'

export function resolveUndeclaredIdentifiersToVariables(name: string): Symbol {
  return new Symbol(name, t.any(), SymbolKind.Variable)
}

export function resolveUndeclaredIdentifiersToFunctions(name: string): Symbol {
  return new Symbol(name, t.any(), SymbolKind.Function)
}

export default function compile(
  source: string,
  {
    resolveUndeclaredIdentifiers = defaultResolveUndeclaredIdentifier,
    buildEnvironment = true,
  }: {
    resolveUndeclaredIdentifiers?: typeof defaultResolveUndeclaredIdentifier
    buildEnvironment?: boolean
  } = {},
): Program {
  let ast = parse(scan(source), { buildEnvironment })
  new BindIdentifiersVisitor(resolveUndeclaredIdentifiers).visit(ast)
  return ast
}
