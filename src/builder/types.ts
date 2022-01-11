import { Configuration } from 'webpack'

export type WebpackMode = 'none' | 'development' | 'production'
export type WebpackRunMode = 'dev' | 'prod' | 'analyze'
export type ConfigType = { new (): { config(): Configuration } }

export interface BuilderProdOptions {}

export interface BuilderDevOptions {
  host: string
  port: number
  open: boolean
  static: string[]
}
