import { CMDDefinition } from '../types'
import { CoreConfig, CustomConfigReader, mergeConfig } from '../../option'
import { App } from '../../core'
import { WebpackBuilder } from '../../builder'

export const cmd: CMDDefinition = {
  name: 'dev',
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
  async run(args = {}) {
    const cmdConfig: CoreConfig = {
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
    const customConfig = CustomConfigReader.readCustomConfig()
    // todo env config
    const options = mergeConfig(cmdConfig, customConfig)
    const app = new App(options)
    const builder = new WebpackBuilder(app)
    await builder.run()
  },
}
