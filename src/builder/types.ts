import { Configuration } from 'webpack'
import { CoreOption } from '../option'

export type WebpackMode = 'none' | 'development' | 'production'
export type ConfigType = {
  new (options: Required<CoreOption>): { config(): Configuration }
}
