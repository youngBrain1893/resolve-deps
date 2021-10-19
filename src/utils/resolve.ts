import path from 'path'

export const validateImportPath = (
  importPath: string,
  validConfig: { extensions: string[] }
): boolean => {
  const extname = path.extname(importPath)
  if (!extname) return true

  return validConfig?.extensions?.includes(extname)
}

export const getMayPkgName = (importPath: string): string => {
  // absolute path
  if (/^(\.|\/)/.test(importPath)) {
    return importPath
  }

  if (importPath.startsWith('@')) {
    return importPath.split('/').slice(0, 2).join('/')
  }

  return importPath.split('/').shift()!
}
