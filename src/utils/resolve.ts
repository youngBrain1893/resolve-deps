import path from 'path'

export const satisfiedExtensions = (
  filename: string,
  extensions: string[]
): boolean => {
  let mayFileName = filename.replace(/^\.+/, '')
  mayFileName = mayFileName.split(path.sep).pop()!

  if (!mayFileName || mayFileName.split('.').length < 2) {
    return true
  }

  const extensionRegs = extensions.map((extension) => {
    const regText = extension.replace(/^\./, '^\\.')
    return new RegExp(regText)
  })

  return extensionRegs.some((reg) => mayFileName.match(reg))
}

export const getMayPkgName = (importPath: string): string => {
  // absolute path
  if (/^(\.|\/)/.test(importPath)) {
    return importPath;
  }

  if (importPath.startsWith('@')) {
    return importPath.split('/').slice(0, 2).join('/');
  }

  return importPath.split('/').shift()!;
}
