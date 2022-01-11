import defu from 'defu'

describe('run', () => {
  it('works', () => {
    const defaultMerge = defu.extend((obj, key, value, namespace) => {
      console.log(obj, key, value, namespace)
      return false
    })
    console.log(
      defaultMerge(
        {
          devServer: {
            any: {
              sub: {
                a: 1,
              },
            },
            static: ['assets'],
          },
        },
        {
          devServer: {
            any: {
              sub: {
                a: 2,
                c: 3,
              },
            },
            static: ['public'],
          },
        }
      )
    )
  })
})
