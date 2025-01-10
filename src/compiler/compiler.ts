import parse from '../parser'
import { Program } from '../nodes'
import scan from '../scanner'
import BindIdentifiersVisitor, {
  defaultResolveUndeclaredIdentifier,
} from './BindIdentifiersVisitor'
import { EnvironmentKind } from '../parser/environment'

export function resolveUndeclaredIdentifiersToVariables() {
  return EnvironmentKind.Variable
}

export function resolveUndeclaredIdentifiersToFunctions() {
  return EnvironmentKind.Function
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
