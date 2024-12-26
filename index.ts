// @ts-ignore
import src from './sample.phlank' with {type: 'text'}

import parse from './parser'
import scan from './scanner'
import { TokenType } from './token'

let tokens = scan(src)
// console.log(tokens.map(t => TokenType[t.type]).join('\n'))
let ast = parse(tokens)
console.log(JSON.stringify(ast, null, 2))
