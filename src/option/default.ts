import { CoreConfig } from './option'

export const DefaultConfig: CoreConfig = {
  mode: 'prod',
  analyze: false,
  debug: false,
  ignoreFiles: [],
  devServer: {
    port: 9000,
    host: 'localhost',
    hot: true,
    open: false,
    compress: true,
    headers: {},
    client: {
      logging: 'warn',
      progress: false,
      overlay: true,
    },
    static: ['public'],
  },
}
