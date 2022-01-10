import webpack from 'webpack'
import { WebpackDevConfig } from './config/dev'
import { WebpackProdConfig } from './config/prod'
import { WebpackAnalyzeConfig } from './config/analyze'
import DevServer, { Configuration } from 'webpack-dev-server'
// import chalk from 'chalk'
// import { AddressInfo } from 'net'
// import * as url from 'url'
import path from 'path'
import { WebpackRunMode, ConfigType } from './types'
import type Hable from 'hable'
import webpackMerge from 'webpack-merge'

const cwd = process.cwd()

export class WebpackBuilder {
  private readonly app: Hable

  constructor(app: Hable) {
    this.app = app
  }

  async callHook(name: string, ...args: any[]) {
    console.log(name)
    if (this.app) {
      await this.app.callHook(name, ...args)
    }
  }

  async run(mode: WebpackRunMode = 'dev') {
    const config = this.getConfig(mode)
    await this.callHook('build:config', { config, merge: webpackMerge })
    const compiler = webpack(config)
    await this.callHook('build:compile', { compiler })
    const startCompile = mode === 'dev' ?
      this.runDevCompiler(compiler) :
      this.runCompiler(compiler)
    const waitCompiled = new Promise<void>((resolve) => {
        compiler.hooks.done.tap('load-resources', async (stats) => {
          await this.callHook('build:compiled', { compiler, stats })
          resolve()
        })
      })
    await Promise.all([
      waitCompiled,
      startCompile,
    ])
    await this.callHook('build:done', { compiler })
  }

  getConfig(mode: WebpackRunMode) {
    const configs: Record<WebpackRunMode, ConfigType> = {
      dev: WebpackDevConfig,
      prod: WebpackProdConfig,
      analyze: WebpackAnalyzeConfig,
    }
    const config = new configs[mode]
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

// console.log(
//   chalk.gray('Compiled successfully.\nWaiting for file changes...')
// )
// const addressInfo = devServer.server?.address?.() as AddressInfo
// console.log(
//   chalk.bold.black('Listening on:'),
//   chalk.blue(
//     url.format({
//       protocol: 'http',
//       port: addressInfo.port,
//       hostname: addressInfo.address,
//     })
//   )
// )