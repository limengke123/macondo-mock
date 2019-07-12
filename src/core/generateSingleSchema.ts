import * as readline from 'readline'
import * as path from 'path'
import * as fs from 'fs'
import {access, accessFile, writeFile} from '../util/fsUtil'
import {success} from '../util/commonUtil'
import {Receiver} from './resolver'

const ERROR_PATH = '2. 生成 schema.json： '

export const generateSingleSchema = function (filePath: fs.PathLike, fileName: string, force: boolean) {
    return accessFile(filePath)
        .then(([exists]: access) => {
            return new Promise<fs.PathLike>((resolve, reject) => {
                if (exists && !force) {
                    // schema.json 文件存在，跳过生成步骤
                    success(`${ERROR_PATH}文件 ${fileName} 已经存在，跳过生成 schema.json 文件步骤`)
                    return resolve(fileName)
                }
                const readStream: fs.ReadStream = fs.createReadStream(filePath as string)
                const rl: readline.Interface = readline.createInterface({
                    input: readStream
                })
                const receiver: Receiver = Receiver.instance()
                rl.on('line', (line: string) => {
                    try {
                        receiver.receive(line)
                    } catch (e) {
                        reject(e)
                    }
                })
                rl.on('close', () => {
                    const schemaJson = receiver.getSchemaJson()
                    const realPath = path.resolve(filePath as string, './schema.json')
                    writeFile(realPath, JSON.stringify(schemaJson))
                        .then(() => {
                            const schemaFilePath = path.resolve(filePath as string, fileName)
                            success(`${ERROR_PATH}成功创建 schema 文件： ${schemaFilePath}`,)
                            resolve(path.resolve(schemaFilePath))
                        })
                        .catch((e: Error) => {
                            reject(e)
                        })
                })
            })
        })
}
