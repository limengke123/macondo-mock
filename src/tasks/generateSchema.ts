import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { writeFile } from '../util'
import { Receiver } from '../resolver'
import { option } from '../index'

export function generateSchema (option: option) {
    return new Promise<string>((resolve, reject) => {
        const { swaggerPath, schemaPath } = option
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
            const realPath = path.resolve(schemaPath, './schema.json')
            writeFile(realPath, JSON.stringify(schemaJson))
                .then(() => {
                    const schemaFilePath = path.resolve(schemaPath, './schema.json')
                    console.log('成功创建 schema 文件：%s', schemaFilePath)
                    resolve(path.resolve(schemaFilePath))
                })
                .catch((e: Error) => {
                    reject(e)
                })
        })
    })
}
