import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { writeFile, accessFile, access } from '../util/fsUtil'
import { Receiver } from '../core/resolver'
import { optionTuple } from '../index'

const SCHEMA_FILE = './schema.json'

export function generateSchema ([option]: optionTuple) {
    const { swaggerPath, schemaPath } = option
    const SCHEMA_FILE_PATH = path.resolve(schemaPath as string, SCHEMA_FILE)
    return accessFile(SCHEMA_FILE_PATH)
        .then(([exists, write]: access) => {
            return new Promise<optionTuple>((resolve, reject) => {
                if (exists) {
                    // schema.json 文件存在，跳过生成步骤
                    console.log(`文件 ${SCHEMA_FILE_PATH} 已经存在，跳过生成 schema.json 文件步骤`)
                    return resolve([option, SCHEMA_FILE_PATH])
                }
                const readStream: fs.ReadStream = fs.createReadStream(swaggerPath as string)
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
                    const realPath = path.resolve(schemaPath as string, './schema.json')
                    writeFile(realPath, JSON.stringify(schemaJson))
                        .then(() => {
                            const schemaFilePath = path.resolve(schemaPath as string, './schema.json')
                            console.log('成功创建 schema 文件：%s', schemaFilePath)
                            resolve([
                                option,
                                path.resolve(schemaFilePath)
                            ])
                        })
                        .catch((e: Error) => {
                            reject(e)
                        })
                })
            })
        })
}
