import { CMDDefinition } from '../types'
import { cmd as devCMD } from './dev'
import { cmd as prodCMD } from './prod'
import { cmd as analyzeCMD } from './analyze'

export default {
  dev: devCMD,
  prod: prodCMD,
  analyze: analyzeCMD,
} as Record<string, CMDDefinition>
