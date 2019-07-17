import * as path from 'path'
import * as fs from 'fs'
import * as fse from 'fs-extra'

export const writeFile = (path: string, data: string) => {
    return fse.outputFile(path, data)
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

export const accessFile = (path: fs.PathLike): Promise<access> => {
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

export const mkdir = (path: fs.PathLike): Promise<[boolean, string | undefined]> => {
    // 低版本不支持生成多级目录
    // node v10.12 才支持recursive功能
    return new Promise<[boolean, any]>(resolve => {
        fs.mkdir(path, {recursive: true}, err => {
            if (err) {
                return resolve([false, err.message])
            }
            return resolve([true, undefined])
        })
    })
}

export const readdir = (dir: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                reject(err)
            }
            resolve(files)
        })
    })
}

export const listDir = (dirPath: string): Promise<string[]> => {
    if (fsStats(dirPath).isDirectory()) {
        return readdir(dirPath)
            .then(list => {
                return Promise.all(list.map(item => listDir(path.resolve(dirPath, item))))
            })
            .then((subTree: string[][]) => {
                // @ts-ignore
                return [].concat(...subTree)
            })
    }
    return Promise.resolve([dirPath])
}

export const fsStats = (path: fs.PathLike): fs.Stats => {
    return fs.statSync(path)
}


export const extractRelativePath = (source: string, separator: '/schema' | '/swagger') : string => {
    const paths =  source.split(separator)
    return paths[paths.length - 1]
}
