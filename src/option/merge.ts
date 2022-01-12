import { CoreConfig } from './option'
import { overrideDefaultMerge } from '../utils/merge'

export const CONFIG_KEY_PATH_TO_OVERRIDE = ['devServer.static']

const defaultMerge = overrideDefaultMerge(CONFIG_KEY_PATH_TO_OVERRIDE)
export const mergeConfig = (...config: CoreConfig[]): CoreConfig => {
  return defaultMerge({}, ...config)
}
