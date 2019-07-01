import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { writeFile } from '../util'
import { Receiver } from '../resolver'
import { optionTuple } from '../index'

export function generateSchema ([option]: optionTuple) {
    return new Promise<optionTuple>((resolve, reject) => {
        const { swaggerPath, schemaPath } = option
        if (!swaggerPath) {
            throw new Error('没有接收到 swaggerPath 字段，请检查下')
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
            if (!schemaPath) {
                throw new Error('没有接收到 schemaPath 字段，请检查下')
            }
            const realPath = path.resolve(schemaPath, './schema.json')
            writeFile(realPath, JSON.stringify(schemaJson))
                .then(() => {
                    const schemaFilePath = path.resolve(schemaPath, './schema.json')
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
}
