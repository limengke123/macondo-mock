import * as cosmiconfig from 'cosmiconfig'
import { option, optionTuple } from '../index'
import {name} from '../../package.json'

export function loadConfig (option: option): Promise<optionTuple> {
    const explorer = cosmiconfig(name)
    return explorer.search()
        .then(result => {
            let mergeOption: option = {}
            if (result) {
                mergeOption = {
                    ...result.config,
                    ...option
                }
            } else {
                mergeOption = option
            }
            if (!mergeOption.schemaPath) {
                throw new Error('不存在 schemaPath 字段')
            }
            if (!mergeOption.swaggerPath) {
                throw new Error('不存在 swaggerPath 字段')
            }
            return [mergeOption, option]
        })
}
