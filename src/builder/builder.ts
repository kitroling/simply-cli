import webpack from 'webpack'
import { WebpackDevConfig } from './config/dev'
import { WebpackProdConfig } from './config/prod'
import { WebpackAnalyzeConfig } from './config/analyze'
import DevServer, { Configuration } from 'webpack-dev-server'
import path from 'path'
import { WebpackRunMode, ConfigType, BuilderDevOptions } from './types'
import chalk from 'chalk'
import { AddressInfo } from 'net'
import * as url from 'url'

const cwd = process.cwd()

// todo debug mode
export class WebpackBuilder {
  private devServer!: DevServer

  async run(mode: WebpackRunMode = 'dev', options?: any) {
    const config = this.getConfig(mode)
    const compiler = webpack(config)
    const startCompile =
      mode === 'dev'
        ? this.runDevCompiler(compiler, options)
        : this.runCompiler(compiler)
    const waitCompiled = new Promise<any>(resolve => {
      compiler.hooks.done.tap('load-resources', resolve)
    })
    await Promise.all([waitCompiled, startCompile])
    if (mode === 'dev') {
      console.log(
        chalk.gray('Compiled successfully.\nWaiting for file changes...')
      )
      const addressInfo = this.devServer.server?.address?.() as AddressInfo
      if (addressInfo) {
        console.log(
          chalk.bold.black('Listening on:'),
          chalk.blue(
            url.format({
              protocol: 'http',
              port: addressInfo.port,
              hostname: addressInfo.address,
            })
          )
        )
      } else {
        throw new Error('No address')
      }
    }
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

  devConfig(devOptions: BuilderDevOptions): Configuration {
    return {
      port: devOptions.port,
      host: devOptions.host,
      hot: true,
      open: devOptions.open,
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
      static: devOptions.static.map(dir => ({
        directory: path.join(cwd, dir),
      })),
    }
  }

  private async runDevCompiler(compiler: webpack.Compiler, options: any) {
    const devServer = new DevServer(this.devConfig(options), compiler)
    await devServer.start()
    this.devServer = devServer
    return compiler
  }
}
