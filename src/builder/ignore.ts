import path from 'path'
import fs from 'fs-extra'
import ignore, {Ignore as IG} from 'ignore'

export interface Options {
  rootDir: string
  ignoreOptions: {
    ignorecase?: boolean
    ignoreCase?: boolean
    allowRelativePaths?: boolean
  }
  ignore: string[]
}

export class Ignore {
  constructor(private readonly options: Options) {}

  ignore!: IG

  static get IGNORE_FILENAME() {
    return '.simplyignore'
  }

  private initIgnore() {
    const ignored = ignore(this.options.ignoreOptions)
    const ignoreFile = path.resolve(this.options.rootDir, Ignore.IGNORE_FILENAME)
    if (fs.existsSync(ignoreFile) && fs.statSync(ignoreFile).isFile()) {
      const doc = fs.readFileSync(ignoreFile, 'utf8')
      ignored.add(doc)
    }
    if (Array.isArray(this.options.ignore) && this.options.ignore.length > 0) {
      ignored.add(this.options.ignore)
    }
    return ignored
  }

  filter(paths: string[]) {
    if (!this.ignore) {
      this.ignore = this.initIgnore()
    }
    return this.ignore.filter(paths)
  }
}