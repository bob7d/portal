import fs from 'fs'
import path from 'path'

// helper wrappers around fs package
export const createReadStream = (path: string) => fs.createReadStream(path)
export const createWriteStream = (path: string) => fs.createWriteStream(path)

function isError(error: any): error is NodeJS.ErrnoException {
  return error instanceof Error
}

// Creates folder at current location
export const mkdir = (pathSegments: string[]) => {
  try {
    fs.mkdirSync(path.join(...pathSegments))
  } catch (error: unknown) {
    // ignore if it already exists
    if (isError(error) && error.code !== 'EEXIST') {
      throw error
    }
  }
}

// Delete folder
export const rm = async (pathSegments: string[]) => {
  return new Promise<void>((resolve, reject) => {
    fs.rm(path.join(...pathSegments), {
      force: true,
      recursive: true
    }, error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

// Check if given folder is empty
export const isEmpty = (dir: string) => fs.readdirSync(dir).length === 0
