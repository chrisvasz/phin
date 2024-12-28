import { Node } from '../nodes'
import * as Nodes from '../nodes'

export enum Kind {
  Variable = 1,
  Function,
  Class,
  ClassProperty,
  ClassMethod,
  ClassConst,
}

// TODO performance
export class Environment {
  private readonly values = new Map<string, Kind>()

  constructor(
    public readonly enclosing: Environment | null,
    nodes: Node[] = [],
  ) {
    this.addNodes(nodes)
  }

  // In PHP, functions do not inherit variables from the parent scope
  private getNonVariable(name: string): Kind | null {
    let local = this.values.get(name)
    if (local && local !== Kind.Variable) return local
    return this.enclosing?.getNonVariable(name) ?? null
  }

  get(name: string): Kind | null {
    return this.values.get(name) ?? this.enclosing?.getNonVariable(name) ?? null
  }

  add(value: string, kind: Kind) {
    this.values.set(value, kind)
  }

  // TODO is this the right place for this responsibility?
  private addNodes(nodes: Node[]) {
    for (let node of nodes) {
      if (node instanceof Nodes.FunctionDeclaration) {
        this.add(node.name, Kind.Function)
      } else if (node instanceof Nodes.ClassDeclaration) {
        this.add(node.name, Kind.Class)
      } else if (node instanceof Nodes.ClassParam) {
        this.add(node.name, Kind.ClassProperty)
      } else if (node instanceof Nodes.ClassProperty) {
        this.add(node.name, Kind.ClassProperty)
      } else if (node instanceof Nodes.ClassMethod) {
        this.add(node.name, Kind.ClassMethod)
      } else if (node instanceof Nodes.ClassConst) {
        this.add(node.name, Kind.ClassConst)
      }
    }
  }
}

export const globalEnvironment = new Environment(null)
globalEnvironment.add('array_push', Kind.Function)
globalEnvironment.add('array', Kind.Function)
