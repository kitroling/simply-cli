require('../dist')
  .run()
  .catch(err => {
    require('consola').fatal(err)
    require('exit')(2)
  })
