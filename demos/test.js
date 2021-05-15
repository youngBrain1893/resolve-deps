const { resolveDependenciesArray, getMayPkgName } = require('../lib/index')
const path = require('path')

;(async function () {
  const res = await resolveDependenciesArray({
    entry: [path.resolve(__dirname, '../src', 'index.ts')],
    resolve: {
      recursion: true,
      extensions: ['.ts'],
      ignore: (dep) => !(dep.startsWith('.') || dep.startsWith('/')),
    },

    // entry: {
    //   dir: path.join(__dirname, '../src'),
    //   include: ['**/*.ts'],
    // },
    // resolve: {
    //   recursion: false,
    // }
  })
  console.log(
    res
      .filter((key) => !(key.startsWith('.') || key.startsWith('/')))
      .map(getMayPkgName)
  )
})()
