import { CMDDefinition } from '../types'

export const cmd: CMDDefinition = {
  params: {
    root: {
      alias: 'r',
      type: 'string',
    },
    debug: {
      type: 'number',
    },
  },
  prepare(args) {
    return {
      rootDir: args.root,
      mode: 'prod',
      debug: args.debug || false,
    }
  },
}
