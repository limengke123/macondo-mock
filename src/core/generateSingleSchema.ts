import * as readline from 'readline'
import * as path from 'path'
import * as fs from 'fs'
import {access, accessFile, writeFile} from '../util/fsUtil'
import {success} from '../util/commonUtil'
import {Receiver} from './resolver'
import {getOption} from './option'

const ERROR_PATH = '2. 生成 schema.json： '
const JSON_EXT = '.json'

const option = getOption()

// 根据swaggerPath，去生成 schema 文件
export const generateSingleSchema = function (swaggerPath: string, targetPath: string, targetFileName: string, force: boolean = true) {
    const targetFilePath = path.resolve(targetPath, targetFileName + JSON_EXT)
    return accessFile(targetFilePath)
        .then(([exists]: access) => {
            return new Promise<string>((resolve, reject) => {
                if (exists && !force) {
                    // schema.json 文件存在，跳过生成步骤
                    success(`${ERROR_PATH}文件 ${targetFilePath} 已经存在，跳过生成 schema.json 文件步骤`)
                    return resolve(targetFilePath)
                }
                const readStream: fs.ReadStream = fs.createReadStream(swaggerPath)
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
                    writeFile(targetFilePath, JSON.stringify(schemaJson))
                        .then(() => {
                            success(`${ERROR_PATH}成功创建 schema 文件： ${targetFilePath}`,)
                            resolve(targetFilePath)
                        })
                        .catch((e: Error) => {
                            reject(e)
                        })
                })
            })
        })
}
