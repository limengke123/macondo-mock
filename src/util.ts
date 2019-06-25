import * as fs from 'fs'

export const writeFile = (path: string, data: string) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (e) => {
            if (e) {
                return reject(e)
            } else {
                resolve('success')
            }
        })
    })
}
