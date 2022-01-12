export interface CMDDefinition {
  name?: string
  params: Record<
    string,
    {
      alias?: string | string[]
      type: 'number' | 'boolean' | 'string'
      default?: any
      array?: boolean
    }
  >
  run(options?: Record<string, any>): Promise<void>
}
