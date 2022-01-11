import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'

export type WebpackRunMode = 'dev' | 'prod' | 'analyze'

export interface CoreConfig {
  mode?: WebpackRunMode
  rootDir?: string
  analyze?: boolean
  debug?: false | number
  ignoreOptions?: {
    ignorecase?: boolean
    ignoreCase?: boolean
    allowRelativePaths?: boolean
  }
  ignoreFiles?: string[]
  devServer?: WebpackDevServerConfiguration
  alias?: Record<string, string | string[]>
}

export interface CoreOption extends Required<CoreConfig> {}
