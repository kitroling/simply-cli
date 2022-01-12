import minimist from 'minimist'
import Commands from './commands'
import { CMDDefinition } from './types'
import { WebpackRunMode } from '../option'

const getRunOptions = (argv: string[]) => {
  const {
    _: [cmd = 'dev'],
  } = minimist(argv, { stopEarly: true })
  const defs = Commands[cmd]
  if (defs) {
    const opts = {
      string: [] as string[],
      boolean: [] as string[],
      alias: {} as Record<string, string | string[]>,
      default: {} as Record<string, any>,
    }
    for (const key in defs.params) {
      const def = defs.params[key]
      switch (def.type) {
        case 'string':
          opts.string.push(key)
          break
        case 'boolean':
          opts.boolean.push(key)
          break
      }
      if (def.alias) {
        opts.alias[key] = def.alias
      }
      if (Object.prototype.hasOwnProperty.call(def, 'default')) {
        opts.default[key] = def.default
      }
    }
    const { _, ...options } = minimist(argv, opts)

    for (const key in defs.params) {
      if (defs.params[key].array) {
        const val = options[key]
        if (!Array.isArray(val)) {
          options[key] = val ? [val] : undefined
        }
      }
    }
    return {
      command: defs,
      cmd,
      ...options,
    } as {
      command: CMDDefinition
      cmd: WebpackRunMode | string
      [key: string]: any
    }
  } else {
    throw new Error('Unknown command')
  }
}

export const run = async () => {
  const argv = process.argv.slice(2)
  const { command, ...runOptions } = getRunOptions(argv)
  await runCommand(command, runOptions)
}

export const runCommand = async (
  command: CMDDefinition,
  params?: Record<string, any>
) => {
  return command.run(params)
}
