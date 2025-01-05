import parse from '../parser'
import { Program } from '../nodes'
import scan from '../scanner'
import BindIdentifiersVisitor, {
  defaultResolveUndeclaredIdentifiers,
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
    resolveUndeclaredIdentifiers = defaultResolveUndeclaredIdentifiers,
    buildEnvironment = true,
  }: {
    resolveUndeclaredIdentifiers?: typeof defaultResolveUndeclaredIdentifiers
    buildEnvironment?: boolean
  } = {},
): Program {
  let ast = parse(scan(source), { buildEnvironment })
  new BindIdentifiersVisitor(resolveUndeclaredIdentifiers).visitProgram(ast)
  return ast
}
