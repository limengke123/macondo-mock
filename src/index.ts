import * as fs from 'fs'
import * as readline from 'readline'
import { Receiver } from './resolver'

interface option {
    filePath: string
}

export const mock = function (option: option): void {
    const { filePath } = option
    const readStream: fs.ReadStream = fs.createReadStream(filePath)
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
        console.log(receiver.getResult())
    })
}
