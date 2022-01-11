import defu from 'defu'

export const overrideDefaultMerge = (override: string[] | string) => {
  if (!Array.isArray(override)) {
    override = override ? [override] : []
  }
  return defu.extend((obj, key, value, namespace) => {
    if (override.includes([namespace, key].join('.'))) {
      obj[key] = value
      return true
    }
    return false
  })
}
