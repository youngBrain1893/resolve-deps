const { resolveDependenciesArray, getMayPkgName } = require('../lib/index')
const path = require('path')
const fs = require('fs')

;(async function () {
  const res = await resolveDependenciesArray({
    entry: {
      dir: path.join(__dirname, '../src'),
      include: ['**/*.ts'],
    },
    resolve: {
      recursion: false,
    },
  })
  const deps = res
    .filter((key) => !(key.startsWith('.') || key.startsWith('/')))
    .map(getMayPkgName)

  const description = require(path.join(__dirname, '../package.json'));
  const notFoundDeps = deps.filter((dep) => {
    return !(
      (description.dependencies || {})[dep] ||
      (description.peerDependencies || {})[dep]
    )
  })
  if (notFoundDeps.length) {
    const errorMsg = `these dependencies used but not found in package.json
    ${notFoundDeps.join('\n')}`
    throw Error(errorMsg)
  } else {
    console.log('dependencies integrity-check passed')
  }
})()
