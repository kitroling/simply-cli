import { CoreConfig } from '../option'

export interface CMDDefinition {
  params: Record<
    string,
    {
      alias?: string | string[]
      type: 'number' | 'boolean' | 'string'
      default?: any
      array?: boolean
    }
  >
  prepare?(args: Record<string, any>): CoreConfig
}
