import path from 'path'
import { ResolverFactory, Resolver } from 'enhanced-resolve'
import graceFulFs from 'graceful-fs'
import { IResolveDepConfig, IResolvedModule } from '../types'

type ResolvedModuleMap = Map<string, IResolvedModule>

class Context {
  config: IResolveDepConfig
  _resolver: Resolver | null
  moduleMap: ResolvedModuleMap
  resolvingSet: Set<string>

  constructor (config: IResolveDepConfig, moduleMap?: ResolvedModuleMap) {
    this.config = config
    this._resolver = null
    this.moduleMap = moduleMap || new Map()
    this.resolvingSet = new Set()
  }

  getResolver (): Resolver {
    const { config } = this
    if (!this._resolver) {
      this._resolver = ResolverFactory.createResolver({
        extensions: config.resolve?.extensions || [],
        fileSystem: graceFulFs as any,
        alias: config.resolve?.alias || {}
      })
    }
    return this._resolver
  }

  resolve (dep: string, from: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.getResolver().resolve(
        {},
        path.dirname(from),
        dep,
        {},
        (err, filePath) => {
          if (err) {
            reject(err)
            throw err
          }
          resolve(filePath as string)
        }
      )
    })
  }
}

export default Context
