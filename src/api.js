const packageJson = require('../package.json')
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import handlebars from 'handlebars'
import { sync as mkdirp } from 'mkdirp'

export function fileExists(file) {
  try {
    fs.accessSync(file, fs.F_OK)
    return true
  } catch (e) {
    return false
  }
}

function recursiveDirectory(input, fn) {
  const isDirectory = fs.lstatSync(input).isDirectory()

  if (isDirectory) {
    const files = fs.readdirSync(input)
    files.forEach(file => {
      const filePath = path.resolve(input, file)
      recursiveDirectory(filePath, fn)
    })
  } else {
    fn(input)
  }
}

function compileTemplate({
  templateFilePath,
  outputFilePath,
  params,
  log = false,
  overwrite = false,
} = {}) {
  const templateFile = fs.readFileSync(templateFilePath, 'utf8')
  const compileFn = handlebars.compile(templateFile)
  const rendered = compileFn(params)

  if (!overwrite && fileExists(outputFilePath)) {
    if (log) console.log(chalk.yellow(`File already exists ${outputFilePath}`))
    return
  }

  if (log) console.log(chalk.green(`Creating the file at ${outputFilePath}`))

  mkdirp(path.dirname(outputFilePath))
  fs.writeFileSync(outputFilePath, rendered)
}

export function compile({
  params = {},
  input,
  output,
  log = false,
  overwrite = false,
} = {}) {

  if (fs.lstatSync(input).isDirectory()) {
    recursiveDirectory(input, (filePath) => {
      if (/^\./.test(path.basename(filePath))) {
        return
      }
      const pathDiff = filePath.replace(input + '/', '')
      const outputFilePath = path.resolve(output, pathDiff)

      compileTemplate({
        templateFilePath: filePath,
        outputFilePath,
        params,
        log,
        overwrite,
      })
    })
  } else {
    compileTemplate({
      templateFilePath: input,
      outputFilePath: output,
      params,
      log,
      overwrite,
    })
  }
}

export function help() {
  console.log(``)
  console.log(`  ${packageJson.name} ${packageJson.version}`)
  console.log(``)
  console.log(`  compile`)
  console.log(`    --[params | p]`)
  console.log(`      json string or json file location or js module export file location`)
  console.log(`    --[input | i]`)
  console.log(`      template input file path can be directory or file`)
  console.log(`    --[output | o]`)
  console.log(`      ouput directory`)
  console.log(`    --[log | l]`)
  console.log(`      log info`)
  console.log(`    --overwrite`)
  console.log(`      overwrite existing file`)
  console.log(``)
}
