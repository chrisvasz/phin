import * as monaco from 'monaco-editor'
import compile from '../src/compiler'
import { PhpPrinter } from '../src/phpPrinter/print'

let phin = monaco.editor.create(document.querySelector('#phin')!, {
  value: `echo "hello world"`,
  language: 'kotlin',
  minimap: { enabled: false },
})
let php = monaco.editor.create(document.querySelector('#php')!, {
  value: ``,
  language: 'php',
  minimap: { enabled: false },
})

let run = document.getElementById('run')!
run.addEventListener('click', () => {
  let src = phin.getValue()
  let ast = compile(src)
  let printed = new PhpPrinter().print(ast)
  php.setValue('<?php\n' + printed)
})
run.click()
