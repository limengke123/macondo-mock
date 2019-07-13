import * as cosmiconfig from 'cosmiconfig'
import { option, optionTuple } from '../index'
import {name} from '../../package.json'
import {success} from '../util/commonUtil'

const ERROR_PATH = '1. 加载 config： '

export function loadConfig (option: option = {}): Promise<optionTuple<undefined>> {
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
            if (!mergeOption.baseOption!.mockPath) {
                throw new Error(ERROR_PATH + '不存在 mockPath 字段')
            }
            success(`${ERROR_PATH} 成功解析配置文件`)
            return [mergeOption, undefined]
        })
}
