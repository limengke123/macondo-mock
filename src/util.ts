import * as fs from 'fs'

export const writeFile = (path: string, data: string) => {
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

export const readJsonFile = (path: string) => {
    return new Promise<object>((resolve, reject) => {
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
