import { WebpackBaseConfig } from './base'
import { WebpackMode } from '../types'

export class WebpackDevConfig extends WebpackBaseConfig {
  get mode(): WebpackMode {
    return 'development'
  }

  optimization() {
    return {
      minimize: false,
    }
  }
}
