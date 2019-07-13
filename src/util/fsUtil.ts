import * as fs from 'fs'
import {rejects} from "assert";

export const writeFile = (path: fs.PathLike, data: string) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, e => {
            if (e) {
                return reject(e)
            } else {
                resolve('success')
            }
        })
    })
}

export function readJsonFile<T> (path: fs.PathLike): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        fs.readFile(path, (e, buf) => {
            if (e) {
                return reject(e)
            } else {
                const stringData = buf.toString()
                try {
                    const data = JSON.parse(stringData)
                    resolve(data)
                } catch (err) {
                    reject(err)
                }
            }
        })
    })
}

// [是否存在, 是否可写]
export type access = [boolean, boolean]

export const accessFile = (path: fs.PathLike) => {
    return new Promise<access>(resolve => {
        fs.access(path, fs.constants.F_OK | fs.constants.W_OK, (err) => {
            if (err) {
                const exists = err.code !== 'ENOENT'
                return resolve([exists, !exists])
            } else {
                return resolve([true, true])
            }
        })
    })
}

export const mkdir = (path: fs.PathLike) => {
    return new Promise<[boolean, any]>(resolve => {
        fs.mkdir(path, {recursive: true}, err => {
            if (err) {
                return resolve([false, err.message])
            }
            return resolve([true, undefined])
        })
    })
}

export const readdir = (path: fs.PathLike) => {
    return new Promise<string[]>((resolve, reject) => {
        fs.readdir(path, ((err, files) => {
            if (err) {
                reject(err)
            }
            resolve(files)
        }))
    })
}

export const fsStats = (path: fs.PathLike): fs.Stats => {
    return fs.statSync(path)
}

export const isDictory = (path: fs.PathLike): boolean => {
    return fsStats(path).isDirectory()
}
