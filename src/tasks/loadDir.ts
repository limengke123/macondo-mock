import * as fs from 'fs'
import * as path from 'path'
import {optionTuple} from '../index'


export function loadDir([option]: optionTuple): Promise<optionTuple> {
    const { baseOption } = option
    const { mockPath } = baseOption!
    return Promise.resolve()
        .then(() => {
            fs.mkdirSync(path.join(process.cwd(), mockPath!))
        })
        .then(() => {
            return [option, undefined]
        })
}
