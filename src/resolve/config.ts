import { IEntry, IEntryGlob } from '../types'
import glob from 'glob'
import path from 'path'

function isGlobEntryConfig(entry: IEntry): entry is IEntryGlob {
  return !!(entry as IEntryGlob)?.dir
}

export const getFiles = (entry: IEntry): string[] => {
  if (isGlobEntryConfig(entry)) {
    let files: string[] = []
    const { dir, include, exclude } = entry
    include?.forEach((pattern) => {
      files = files.concat(glob.sync(pattern, { cwd: dir }))
    })
    const resultSet = new Set(files)
    exclude?.forEach((pattern) => {
      glob.sync(pattern, { cwd: dir }).forEach((file) => {
        resultSet.delete(file)
      })
    })

    return Array.from(resultSet).map((file) => path.join(entry.dir, file))
  } else {
    return entry
  }
}
