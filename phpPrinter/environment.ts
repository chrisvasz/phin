import { Node } from '../nodes'
import * as Nodes from '../nodes'

export enum Kind {
  Var,
  Function,
  Class,
  ClassProperty,
  ClassMethod,
}

export class Environment {
  private readonly values = new Map<string, Kind>()

  constructor(
    public readonly enclosing: Environment | null,
    nodes: Node[] = [],
  ) {
    this.addNodes(nodes)
  }

  get(name: string): Kind | null {
    return this.values.get(name) ?? this.enclosing?.get(name) ?? null
  }

  add(value: string, kind: Kind) {
    this.values.set(value, kind)
  }

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
      } else if (node instanceof Nodes.ForeachVariable) {
        this.add(node.name, Kind.Var)
      }
    }
  }
}

export const globalEnvironment = new Environment(null)
globalEnvironment.add('array_push', Kind.Function)
