import process from 'process'
import chalk from 'chalk'
import path from 'path'
import {
  compile,
  help,
  fileExists,
} from './api.js'

function getParams() {
  const argv = require('yargs').argv
  const arg = argv.params || argv.p

  if (/\.(js|json)$/.test(arg)) {
    const filePath = path.resolve('.', arg)
    if (!fileExists(filePath)) {
      console.log(chalk.red(`Not valid params path.`))
      process.exit(-1)
    }
    return require(filePath)
  } else {
    try {
      const parsed = JSON.parse(arg)
      return parsed
    } catch (e) {
      console.log(chalk.red(`Not valid params must be json format.`))
      process.exit(-1)
    }
  }
}

export default function commandHandler() {
  const argv = require('yargs').argv
  const command = argv._[0]

  switch(command) {
  case 'compile':
  case 'c':
    const params = getParams()
    const input = path.resolve('.', argv.input || argv.i)
    const output = path.resolve('.', argv.output || argv.o)
    const log = Boolean(argv.log || argv.l)

    if (!fileExists(input)) {
      console.log(chalk.red(`Input file path is not valid.`))
      process.exit(-1)
    }

    compile({
      params,
      input,
      output,
      log,
    })
    break
  default:
    help()
    return
  }
}
