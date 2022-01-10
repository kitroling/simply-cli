import webpack from 'webpack'
import { WebpackDevConfig } from './config/dev'
import { WebpackProdConfig } from './config/prod'
import { WebpackAnalyzeConfig } from './config/analyze'
import DevServer, { Configuration } from 'webpack-dev-server'
import path from 'path'
import { WebpackRunMode, ConfigType } from './types'

const cwd = process.cwd()

export class WebpackBuilder {
  async run(mode: WebpackRunMode = 'dev') {
    const config = this.getConfig(mode)
    const compiler = webpack(config)
    const startCompile =
      mode === 'dev'
        ? this.runDevCompiler(compiler)
        : this.runCompiler(compiler)
    const waitCompiled = new Promise<any>(resolve => {
      compiler.hooks.done.tap('load-resources', resolve)
    })
    await Promise.all([waitCompiled, startCompile])
  }

  getConfig(mode: WebpackRunMode) {
    const configs: Record<WebpackRunMode, ConfigType> = {
      dev: WebpackDevConfig,
      prod: WebpackProdConfig,
      analyze: WebpackAnalyzeConfig,
    }
    const config = new configs[mode]()
    return config.config()
  }

  private runCompiler(compiler: webpack.Compiler) {
    return new Promise((resolve, reject) => {
      compiler.run(err => {
        if (err) reject(err)
        else resolve(compiler)
      })
    })
  }

  devConfig(): Configuration {
    return {
      port: 9000,
      host: 'localhost',
      hot: true,
      open: false,
      compress: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
      },
      client: {
        logging: 'warn',
        progress: false,
        overlay: true,
      },
      static: {
        directory: path.join(cwd, 'public'),
      },
    }
  }

  private async runDevCompiler(compiler: webpack.Compiler) {
    const devServer = new DevServer(this.devConfig(), compiler)
    await devServer.start()
    return compiler
  }
}
