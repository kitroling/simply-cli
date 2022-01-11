import path from 'path'
import fs from 'fs-extra'
import ignore, { Ignore as IG } from 'ignore'
import { CoreOption } from '../option'

export class Ignore {
  constructor(private readonly options: CoreOption) {}

  ignore!: IG

  static get IGNORE_FILENAME() {
    return '.simplyignore'
  }

  private initIgnore() {
    const ignored = ignore(this.options.ignoreOptions)
    const ignoreFile = path.resolve(
      this.options.rootDir,
      Ignore.IGNORE_FILENAME
    )
    if (fs.existsSync(ignoreFile) && fs.statSync(ignoreFile).isFile()) {
      const doc = fs.readFileSync(ignoreFile, 'utf8')
      ignored.add(doc)
    }
    if (
      Array.isArray(this.options.ignoreFiles) &&
      this.options.ignoreFiles.length > 0
    ) {
      ignored.add(this.options.ignoreFiles)
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
