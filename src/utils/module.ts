import { IResolvedModule } from '../types'

export const generateIgnoredResolvedModule = (
  dependencies: string[]
): IResolvedModule[] => {
  return dependencies.map((dependence) => ({
    name: dependence,
    deps: [],
    ignore: true,
  }))
}

export const parseModuleDepsToArray = (depMap: Map<string, IResolvedModule>): string[] => {
  const resultSet = new Set<string>();
  Array.from(depMap.values()).forEach(({ name, deps }) => {
    resultSet.add(name);
    deps.forEach(({ name }) => resultSet.add(name));
  })

  return Array.from(resultSet);
}
