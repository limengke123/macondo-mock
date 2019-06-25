import * as fs from 'fs'
import * as readline from 'readline'
import * as path from 'path'
import { Receiver } from './resolver'
import { writeFile } from './util'

interface option {
    swaggerPath: string,
    schemaPath: string
}

export const mock = function (option: option): void {
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
            console.log(e.message)
            process.exit(-1)
        }
    })
    rl.on('close', () => {
        const schemaJson = receiver.getSchemaJson()
        const realPath = path.resolve(schemaPath, './schema.json')
        writeFile(realPath, JSON.stringify(schemaJson))
            .then(() => {
                console.log('成功创建 schema 文件：%s', schemaPath)
            })
            .catch((e: Error) => {
                console.log('创建 schema 文件失败：\n')
                console.log(e.message)
                process.exit(1)
            })
    })
}
