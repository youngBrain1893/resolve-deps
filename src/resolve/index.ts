// @ts-ignore
import precinct from 'precinct'

import Context from './context'
import type { IResolveDepConfig, IResolvedModule } from '../types'
import {
  generateIgnoredResolvedModule,
  satisfiedExtensions,
  parseModuleDepsToArray,
} from '../utils'
import { getFiles } from './config'

async function resolveAbsolutePath(
  ctx: Context,
  deps: string | string[],
  from: string
): Promise<string[]> {
  let depArr: string[] = deps as string[]
  if (!Array.isArray(deps)) {
    depArr = [deps]
  }

  return Promise.all(depArr.map((dep) => ctx.resolve(dep, from)))
}

async function resolveDep(ctx: Context, filename: string) {
  if (ctx.moduleMap.has(filename)) return ctx.moduleMap.get(filename)!

  ctx.resolvingSet.add(filename)
  const result: IResolvedModule = { name: filename, deps: [] }

  const { config } = ctx
  let curResult: string[] = precinct.paperwork(filename, {
    includeCore: false,
  })

  const extensionIgnore: string[] = []
  curResult = curResult.filter((dep) =>
    satisfiedExtensions(dep, config.resolve?.extensions || [])
  )

  if (config.resolve?.recursion !== false) {
    let ignoreDeps: string[] = []
    let recursionDeps: string[] = curResult

    if (config.resolve?.ignore) {
      ignoreDeps = curResult.filter((dep) =>
        config.resolve?.ignore!(dep, filename)
      )
      recursionDeps = curResult.filter(
        (dep) => !config.resolve?.ignore!(dep, filename)
      )
    }

    if (config.includeIgnore !== false) {
      result.deps = result.deps.concat(
        generateIgnoredResolvedModule(ignoreDeps)
      )
    }

    let recursionDepAbsPaths = await resolveAbsolutePath(
      ctx,
      recursionDeps,
      filename
    )
    for (let idx = 0; idx < recursionDepAbsPaths.length; idx++) {
      const entry = recursionDepAbsPaths[idx]
      if (ctx.resolvingSet.has(entry)) {
        console.log(
          `WARN: may circle deps\nfrom: ${filename}\nimport: ${entry}`
        )
        continue
      }

      result.deps.push(await resolveDep(ctx, entry))
    }
  } else {
    result.deps = result.deps.concat(generateIgnoredResolvedModule(curResult))
  }

  if (config.includeIgnore !== false) {
    result.deps = result.deps.concat(
      generateIgnoredResolvedModule(extensionIgnore)
    )
  }

  ctx.moduleMap.set(filename, result);
  ctx.resolvingSet.delete(filename)

  return result
}

export async function resolveDependencies(config: IResolveDepConfig) {
  const ctx = new Context(config)
  const files = getFiles(config.entry)

  for (let idx = 0; idx < files.length; idx++) {
    await resolveDep(ctx, files[idx])
  }

  return ctx.moduleMap
}

export async function resolveDependenciesArray(config: IResolveDepConfig) {
  const moduleMap = await resolveDependencies(config)
  return parseModuleDepsToArray(moduleMap)
}
