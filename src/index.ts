import * as fs from 'fs'
import * as readline from 'readline'
interface option {
    filePath: string
}

export const mock = function (option: option): void {
    const { filePath } = option
    const readStream: fs.ReadStream = fs.createReadStream(filePath)
    const rl: readline.Interface = readline.createInterface({
        input: readStream
    })
    rl.on('line', line => {
        console.log(line)
    })
}
