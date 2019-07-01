import * as fs from 'fs'

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

export const readJsonFile = (path: fs.PathLike) => {
    return new Promise<any>((resolve, reject) => {
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
