import { CMDDefinition } from '../types'

export const cmd: CMDDefinition = {
  params: {
    root: {
      alias: 'r',
      type: 'string',
    },
    port: {
      alias: 'p',
      type: 'number',
    },
    host: {
      type: 'string',
    },
    open: {
      type: 'boolean',
    },
    static: {
      type: 'string',
      array: true,
    },
    debug: {
      type: 'number',
    },
  },
  prepare(args) {
    return {
      rootDir: args.root,
      mode: 'dev',
      debug: args.debug || false,
      devServer: {
        port: args.port,
        host: args.host,
        open: args.open,
        static: args.static,
      },
    }
  },
}
